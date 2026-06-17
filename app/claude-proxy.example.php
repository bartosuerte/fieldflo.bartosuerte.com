<?php
/**
 * OPTIONAL - Live Claude proxy for fieldflo.bartosuerte.com/app (the Applicant Review Tool)
 * ---------------------------------------------------------
 * The site works fully WITHOUT this file (client-side engine).
 * Enable this only if you want the "Ask" / "Tailor" features to
 * call real Claude. Your API key stays server-side, never in the browser.
 *
 * SETUP (SiteGround):
 *   1. Upload this file next to index.html in the subdomain folder.
 *   2. Set your key. Preferred: add to a .env or server var. Simplest:
 *      replace getenv('ANTHROPIC_API_KEY') below with 'sk-ant-...'.
 *      (If you hardcode it, make sure this file is NOT in a public git repo.)
 *   3. In index.html, set:  const LIVE_AI = true;
 *
 * COST/ABUSE NOTE: this calls a paid API. It uses the cheap Haiku model,
 * caps output tokens, and includes a tiny rate-limit. Keep an eye on usage,
 * or leave LIVE_AI=false to stay 100% free.
 */

header('Content-Type: application/json');

// ---- same-origin guard ----
// Works on ANY host you deploy to. Browsers block cross-origin reads anyway;
// this just rejects cross-site POSTs whose Origin host differs from this host.
$host = $_SERVER['HTTP_HOST'] ?? '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($origin) {
  $oh = parse_url($origin, PHP_URL_HOST);
  if ($oh && $host && strcasecmp($oh, $host) !== 0) {
    http_response_code(403); echo json_encode(['error'=>'cross-origin blocked','answer'=>'(Blocked: cross-origin request.)']); exit;
  }
}

// ---- tiny rate limit: 20 requests / 10 min per IP ----
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x';
$bucket = sys_get_temp_dir().'/rl_'.md5($ip).'.json';
$now = time(); $hits = [];
if (is_file($bucket)) { $hits = json_decode(@file_get_contents($bucket), true) ?: []; }
$hits = array_filter($hits, fn($t)=>$t > $now-600);
if (count($hits) >= 20) { http_response_code(429); echo json_encode(['error'=>'rate_limited']); exit; }
$hits[] = $now; @file_put_contents($bucket, json_encode(array_values($hits)));

// ---- read request ----
$in = json_decode(file_get_contents('php://input'), true) ?: [];
$mode = $in['mode'] ?? 'ask';
$question = trim($in['question'] ?? '');
$jd = trim($in['jd'] ?? '');
$url = trim($in['url'] ?? '');
if ($mode === 'ask' && $question === '') { echo json_encode(['answer'=>'Ask me a question about my work.']); exit; }

/* ----------------------------------------------------------
   fetch_url - server-side fetch of a candidate's website so the
   tool can actually READ and grade the page text. No API key
   needed for this mode (it just returns cleaned visible text).
   ---------------------------------------------------------- */
if ($mode === 'fetch_url') {
  if (!preg_match('#^https?://#i', $url)) $url = 'https://'.$url;
  // block private / internal hosts (basic SSRF guard)
  $host = parse_url($url, PHP_URL_HOST);
  $ip = $host ? gethostbyname($host) : '';
  if (!$host || filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
    echo json_encode(['text'=>'', 'error'=>'blocked_host']); exit;
  }
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER=>true, CURLOPT_FOLLOWLOCATION=>true, CURLOPT_MAXREDIRS=>3,
    CURLOPT_TIMEOUT=>15, CURLOPT_SSL_VERIFYPEER=>true, CURLOPT_ENCODING=>'',
    // present as a real browser so sites that merely block odd user-agents still serve us
    CURLOPT_USERAGENT=>'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    CURLOPT_HTTPHEADER=>[
      'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language: en-US,en;q=0.9',
    ],
  ]);
  $html = curl_exec($ch);
  $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
  curl_close($ch);
  // NEVER fold an error page or non-HTML response into the grade (e.g. a 403 the
  // browser never sees because the visitor passed a bot check the server can't).
  if (!$html || $code >= 400 || stripos((string)$type, 'html') === false) {
    echo json_encode(['text'=>'', 'status'=>$code, 'error'=>'fetch_blocked']); exit;
  }
  // bot/JS challenge pages return 200 but contain no real content - reject those too
  if (preg_match('/just a moment|checking your browser|cf-browser-verification|attention required|please enable javascript|verifying you are human|captcha/i', substr($html, 0, 4000))) {
    echo json_encode(['text'=>'', 'status'=>$code, 'error'=>'bot_challenge']); exit;
  }
  // strip scripts/styles, collapse tags to text
  $html = preg_replace('#<(script|style|noscript|svg|head)[^>]*>.*?</\1>#is', ' ', $html);
  $text = html_entity_decode(strip_tags($html), ENT_QUOTES|ENT_HTML5, 'UTF-8');
  $text = trim(preg_replace('/\s+/', ' ', $text));
  if (mb_strlen($text) > 8000) $text = mb_substr($text, 0, 8000); // cap
  echo json_encode(['text'=>$text]); exit;
}

// Provide your key via the server env var ANTHROPIC_API_KEY, or paste it at deploy time. Do NOT commit a real key.
$API_KEY = getenv('ANTHROPIC_API_KEY') ?: '';  // set ANTHROPIC_API_KEY on the server, or paste 'sk-ant-...' here at deploy time (never commit the real key)
if (!$API_KEY) { echo json_encode(['answer'=>'(Live AI not configured - paste your key into $API_KEY.)']); exit; }

// quick connection test (no Claude call, no cost)
if ($mode === 'ping') { echo json_encode(['ok'=>true, 'key'=> (strlen($API_KEY) > 10)]); exit; }

$name = trim($in['name'] ?? 'the applicant');
$applicant_text = trim($in['text'] ?? '');
$is_william = !empty($in['is_william']);

/* ----------------------------------------------------------
   ocr - transcribe a PDF or image with Claude's vision. Used as
   a fallback when in-browser parsing finds no selectable text
   (scanned PDFs, photos of documents, image resumes).
   Expects: { mode:'ocr', media_type:'application/pdf'|'image/png'..., data:'<base64>' }
   Returns: { text:'...verbatim transcription...' }
   ---------------------------------------------------------- */
if ($mode === 'ocr') {
  $media = strtolower(trim($in['media_type'] ?? ''));
  $b64   = $in['data'] ?? '';
  if ($b64 === '') { echo json_encode(['text'=>'', 'error'=>'no_data']); exit; }
  if (strlen($b64) > 28000000) { echo json_encode(['text'=>'', 'error'=>'file_too_large']); exit; }
  if (strpos($media, 'pdf') !== false) {
    $block = ['type'=>'document', 'source'=>['type'=>'base64', 'media_type'=>'application/pdf', 'data'=>$b64]];
  } else {
    if (!preg_match('#^image/(png|jpe?g|webp|gif)$#', $media)) $media = 'image/png';
    $block = ['type'=>'image', 'source'=>['type'=>'base64', 'media_type'=>$media, 'data'=>$b64]];
  }
  $payload = [
    'model' => 'claude-haiku-4-5-20251001',
    'max_tokens' => 4096,
    'system' => 'You are a precise OCR and document-transcription engine. Transcribe ALL text from the provided document or image verbatim, preserving the natural reading order and line breaks. Include the person\'s name, headings, body text, bullet points, and captions. Do NOT summarize, interpret, or add anything not present. If there is no readable text, reply with an empty string.',
    'messages' => [['role'=>'user', 'content'=>[
      $block,
      ['type'=>'text', 'text'=>'Transcribe every word of text in this file, in reading order.'],
    ]]],
  ];
  $ch = curl_init('https://api.anthropic.com/v1/messages');
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['content-type: application/json', 'x-api-key: '.$API_KEY, 'anthropic-version: 2023-06-01'],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 60,
  ]);
  $res = curl_exec($ch);
  if ($res === false) { echo json_encode(['text'=>'', 'error'=>curl_error($ch)]); exit; }
  curl_close($ch);
  $data = json_decode($res, true);
  if (isset($data['error'])) { echo json_encode(['text'=>'', 'error'=>($data['error']['message'] ?? 'api_error')]); exit; }
  echo json_encode(['text'=>($data['content'][0]['text'] ?? '')]); exit;
}

/* ----------------------------------------------------------
   name - identify the applicant's full name from their documents,
   so the Match report header uses the real name instead of a
   first-line guess. Returns: { answer:'Full Name' } or 'Applicant'.
   ---------------------------------------------------------- */
if ($mode === 'name') {
  if ($applicant_text === '') { echo json_encode(['answer'=>'Applicant']); exit; }
  $payload = [
    'model' => 'claude-haiku-4-5-20251001',
    'max_tokens' => 24,
    'system' => 'You extract the applicant/candidate full name from resume or cover-letter text. Reply with ONLY the person\'s full name and nothing else - no labels, quotes, or punctuation around it. If no clear personal name is present, reply with exactly: Applicant.',
    'messages' => [['role'=>'user', 'content'=>"Candidate documents:\n".mb_substr($applicant_text, 0, 6000)."\n\nApplicant full name:"]],
  ];
  $ch = curl_init('https://api.anthropic.com/v1/messages');
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['content-type: application/json', 'x-api-key: '.$API_KEY, 'anthropic-version: 2023-06-01'],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 20,
  ]);
  $res = curl_exec($ch);
  if ($res === false) { echo json_encode(['answer'=>'Applicant', 'error'=>curl_error($ch)]); exit; }
  curl_close($ch);
  $data = json_decode($res, true);
  if (isset($data['error'])) { echo json_encode(['answer'=>'Applicant', 'error'=>($data['error']['message'] ?? 'api_error')]); exit; }
  $nm = trim($data['content'][0]['text'] ?? '');
  echo json_encode(['answer'=>($nm !== '' ? $nm : 'Applicant')]); exit;
}

/* ----------------------------------------------------------
   quote - pick the single most meaningful VERBATIM line from the
   candidate's own writing (preferring the cover letter / personal
   statement) for the candidate-profile pull quote.
   Returns: { answer:'...the exact sentence...' }
   ---------------------------------------------------------- */
if ($mode === 'quote') {
  if ($applicant_text === '') { echo json_encode(['answer'=>'']); exit; }
  $payload = [
    'model' => 'claude-haiku-4-5-20251001',
    'max_tokens' => 120,
    'system' => 'You select a single pull quote for a candidate profile. Choose the ONE sentence from the candidate\'s OWN words that best captures who they are, why they fit, or what drives them - strongly prefer the cover letter or personal statement over the resume. Copy it VERBATIM. Do NOT include headings, labels, file names, contact lines, or fragments - it must be a complete, well-formed sentence in the first person where possible. Return ONLY that sentence, with no surrounding quotation marks and no commentary. Keep it under 240 characters; if the best sentence is longer, trim to a clean clause. If nothing suitable exists, return an empty string.',
    'messages' => [['role'=>'user', 'content'=>"Candidate ({$name}) documents:\n".mb_substr($applicant_text, 0, 12000)."\n\nBest pull quote (verbatim):"]],
  ];
  $ch = curl_init('https://api.anthropic.com/v1/messages');
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['content-type: application/json', 'x-api-key: '.$API_KEY, 'anthropic-version: 2023-06-01'],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 25,
  ]);
  $res = curl_exec($ch);
  if ($res === false) { echo json_encode(['answer'=>'', 'error'=>curl_error($ch)]); exit; }
  curl_close($ch);
  $data = json_decode($res, true);
  if (isset($data['error'])) { echo json_encode(['answer'=>'', 'error'=>($data['error']['message'] ?? 'api_error')]); exit; }
  echo json_encode(['answer'=>trim($data['content'][0]['text'] ?? '')]); exit;
}

// ---- William's background (used when the loaded applicant is William) ----
$WILLIAM = <<<TXT
You are answering AS William R. Barton on his interactive resume, in his voice: warm, direct, confident, no fluff, honest about gaps.
FACTS:
- 15+ years as a web, brand, and graphic designer; currently freelance (Bartosuerte).
- Builds primarily in Webflow; actively transitioning to a Claude AI workflow (cowork + Claude Code in VS Code) for custom builds, with GitHub for version control.
- Has built real things with Claude, incl. this applicant-review tool and an in-progress personal-finance app.
- Humble & Fume (Creative Marketing Director, 2020-22): replaced legacy system with scalable Webflow+Klaviyo framework; investor-relations/compliance-heavy; +20% email revenue.
- Strong on visual design, brand, clean layout/hierarchy, bias to action.
- Honest gaps: not a traditional product designer; no published product portfolio yet; offers live walkthroughs.
- Chattanooga, TN. barton@bartosuerte.com, bartosuerte.com.
Keep answers under 90 words. Never invent employers, dates, or skills not listed.
TXT;

// For any other applicant, answer objectively from THEIR documents only.
$GENERIC = "You are an objective hiring assistant helping a recruiter review a candidate named {$name}. "
  . "Answer ONLY from the candidate's documents below. Be concise (under 90 words), factual, and neutral. "
  . "If the documents don't cover the question, say so plainly. Never invent employers, dates, skills, or metrics.\n\n"
  . "CANDIDATE DOCUMENTS:\n" . mb_substr($applicant_text, 0, 12000);

$system = $is_william ? $WILLIAM : $GENERIC;
$max = 300;

if ($mode === 'categories') {
  // one short summary per scoring category, returned as a JSON map
  $cats = $in['categories'] ?? [];
  $names = array_map(function($c){ return is_array($c) ? ($c['name'] ?? '') : (string)$c; }, $cats);
  $catlist = implode(", ", array_filter($names));
  $system = "You are an objective hiring analyst. For each named category, summarize in ONE to TWO sentences how the candidate's documents support (or fail to support) that category for the role. Be specific, neutral, and honest about gaps. Never invent employers, dates, skills, or metrics.";
  $prompt = "ROLE:\n$jd\n\nCANDIDATE ({$name}) DOCUMENTS:\n" . mb_substr($applicant_text, 0, 12000)
    . "\n\nCATEGORIES: $catlist"
    . "\n\nReturn ONLY a JSON object whose keys are the EXACT category names listed above and whose values are the plain-text summary strings. No markdown, no code fences, no extra text.";
  $max = 750;
} elseif ($mode === 'analyze') {
  // Claude's qualitative read of the documents vs the role (complements the numeric score)
  $system = "You are an objective hiring analyst. Assess the candidate's fit for the role using ONLY their documents. "
    . "Be concise, neutral, specific, and honest about gaps. Never invent employers, dates, skills, or metrics.";
  $prompt = "ROLE:\n$jd\n\nCANDIDATE ({$name}) DOCUMENTS:\n" . mb_substr($applicant_text, 0, 12000)
    . "\n\nReturn plain text with EXACTLY these four labelled sections, each starting on its own line:\n"
    . "VERDICT: two sentences on overall fit.\n"
    . "STRENGTHS: up to three lines, each starting with '- '.\n"
    . "GAPS: up to three lines (gaps or things to verify), each starting with '- '.\n"
    . "QUESTIONS: three numbered interview questions tailored to this candidate.";
  $max = 650;
} elseif ($mode === 'tailor') {
  $prompt = "Here is a job description:\n\n$jd\n\nIn under 110 words, explain how the candidate fits this specific role, leading with the strongest matches. Be concrete.";
} else {
  $prompt = "Recruiter's question: \"$question\"";
}

$payload = [
  'model' => 'claude-haiku-4-5-20251001',
  'max_tokens' => $max,
  'system' => $system,
  'messages' => [['role'=>'user','content'=>$prompt]],
];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    'content-type: application/json',
    'x-api-key: '.$API_KEY,
    'anthropic-version: 2023-06-01',
  ],
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_TIMEOUT => 30,
]);
$res = curl_exec($ch);
if ($res === false) { echo json_encode(['answer'=>'(Live AI error: '.curl_error($ch).')']); exit; }
curl_close($ch);

$data = json_decode($res, true);
$text = $data['content'][0]['text'] ?? '(No response.)';
echo json_encode(['answer'=>$text]);
