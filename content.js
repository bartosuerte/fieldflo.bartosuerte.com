/* ============================================================
   content.js — ALL editable text for fieldflo.bartosuerte.com (resume at /)
   ------------------------------------------------------------
   This is the ONE file to edit your site's words. index.html reads
   from window.SITE below and fills the page in. (The HTML also keeps
   a baked-in fallback copy, so the page never goes blank if this file
   is missing or has a typo.)

   HOW TO EDIT
   - Change text between the quotes. Keep the quotes, colons and commas.
   - For lines with <mark class="hilite">…</mark> or <span class="gold">…</span>,
     keep those tags — they control the gold highlight / accent.
   - After editing, bump the ?v= number on the content.js tag in index.html
     (e.g. content.js?v=2) so browsers load the fresh copy.
   ============================================================ */
window.SITE = {
  /* Browser tab title + meta description (SEO) */
  meta: {
    title: "William R. Barton - Graphic & Web Designer",
    description:
      "Interactive resume of William R. Barton, a graphic and web designer in Chattanooga, TN (EST) - brand, web, and AI-assisted builds.",
  },

  /* Top navigation bar */
  nav: {
    logoHtml: "WILLIAM R. BARTON<span>Graphic &amp; Web Designer</span>",
    links: [
      { label: "Why me", href: "#fit" },
      { label: "Experience", href: "#work" },
      { label: "Skills", href: "#skills" },
      { label: "Capabilities", href: "#services" },
    ],
    portfolio: { label: "View Portfolio", href: "https://bartosuerte.com" },
    tool: {
      label: "Applicant Review Tool",
      href: "/app/",
    },
  },

  /* Hero (top of page) */
  hero: {
    badge: "Open to work · Chattanooga, TN (EST) · Remote",
    nameHtml: 'WILLIAM<br><span class="l2">BARTON</span>',
    role: "Graphic &amp; Web Designer <b>·</b> Branding <b>·</b> Building with AI",
    lead: "A web, brand, and graphic designer with 15+ years creating clean, on-brand digital work. I build primarily in Webflow and am actively moving into a Claude AI workflow for custom builds. I would rather show the work than describe it, so there is a piece of it at the bottom of this page.",
    portrait: "barton-headshot-nice.png",
    contacts: [
      {
        icon: "phone",
        label: "Call",
        value: "(512) 234-0620",
        href: "tel:+15122340620",
      },
      {
        icon: "mail",
        label: "Email",
        value: "barton@bartosuerte.com",
        href: "mailto:barton@bartosuerte.com",
      },
      {
        icon: "linkedin",
        label: "LinkedIn",
        value: "in/bartosuerte",
        href: "https://linkedin.com/in/bartosuerte",
      },
    ],
  },

  /* "Why we should talk" cover-letter section */
  fit: {
    eyebrow: "A note from me",
    titleHtml: 'Why we should <span class="gold">talk</span>',
    paragraphs: [
      `I'll be straight with you. <mark class="hilite">I'm not a traditional product designer</mark>, and I don't have a published product portfolio yet. What I do have is fifteen years of turning vague briefs into clean, on-brand work, and a <mark class="hilite">fast-growing habit of building with AI.</mark>`,
      `I've been <mark class="hilite">leaning hard into Claude Code</mark>. The Applicant Review Tool at the bottom of this page isn't a mockup, I <mark class="hilite">designed and built it end to end in a few hours</mark> using a Claude-native workflow, to my own design system.`,
      `I also know how to make complex things feel simple. I lead with hierarchy and clarity, <mark class="hilite">prioritize progress over perfection</mark>, and I've turned messy systems into ones that actually work. At Humble &amp; Fume I replaced a legacy web interface with a scalable framework using Webflow, Zapier, and Klaviyo <mark class="hilite">and drove a 20% lift in email revenue on our retail site</mark>.`,
      `If you need a perfectly conventional resume, I am probably not your person. If you want <mark class="hilite">a designer with a strong eye, a bias to action, and a real passion for learning and building with AI</mark>, then let's talk.`,
    ],
    signoffClose: "Sincerely,",
    signature: "signature.png",
  },

  /* Experience (each role expands on click) */
  experience: {
    eyebrow: "The track record",
    title: "Experience",
    sub: "Click any role to expand. Fifteen years across brand, web, and creative production.",
    roles: [
      {
        role: "Graphic & Web Designer",
        co: "Bartosuerte (Freelance)",
        yr: "2009 - Present",
        open: true,
        bullets: [
          "Design and build responsive, on-brand websites end to end - from brief and wireframes to a shipped site - primarily in Webflow.",
          "Deliver full creative services across branding, graphic design, and photography for a recurring roster of clients.",
          "Increasingly use Claude (cowork + Claude Code, in VS Code) to build custom features beyond Webflow's defaults.",
          "Apply strong visual hierarchy and clean layout so visitors find what they need quickly.",
          "Build marketing automations and integrations (Klaviyo, Zapier, Google Workspace) connecting content and operations.",
        ],
      },
      {
        role: "Creative Marketing Director",
        co: "Humble & Fume Inc. (Remote)",
        yr: "2020 - 2022",
        bullets: [
          "Replaced legacy marketing systems with a scalable Webflow + Klaviyo framework that improved conversion tracking and campaign effectiveness - a systems redesign, not a reskin.",
          "Owned communications in a compliance-sensitive, investor-relations-heavy environment.",
          "Drove a 20% increase in email marketing revenue through template and delivery/retention redesign.",
          "Shipped integrated campaigns across multiple channels with consistent messaging.",
        ],
      },
      {
        role: "Digital Designer & Photographer",
        co: "One Tree Forest Films",
        yr: "2018 - 2020",
        bullets: [
          "Produced cross-platform digital assets and photography aligned to client specs and brand systems.",
          "Worked in fast-paced, deadline-driven production environments with a high attention to detail.",
        ],
      },
      {
        role: "Junior Designer & Web Manager",
        co: "Windship Trading Co.",
        yr: "2011 - 2016",
        bullets: [
          "Managed an e-commerce platform end to end; grew online sales through optimized merchandising and clean UX.",
          "Produced and adapted design assets alongside senior designers.",
        ],
      },
    ],
  },

  /* Skills + stack. Each skill is [name, percent]. Tools: [name, 1=gold/0=grey] */
  skills: {
    eyebrow: "The toolkit",
    titleHtml: 'Skills &amp; <span class="gold">stack</span>',
    sub: "Honest levels. Visual and web design are my core; the AI workflow is newer and growing fast, backed by real built work like the tool at the bottom of this page.",
    groups: [
      {
        cat: "Visual & brand",
        items: [
          ["Adobe Suite", 95],
          ["Figma", 85],
          ["Brand Development", 85],
        ],
      },
      {
        cat: "Web design & build",
        items: [
          ["Webflow", 80],
          ["HTML / CSS / Java", 70],
        ],
      },
      {
        cat: "AI & technical · growing",
        items: [
          ["Claude (Cowork + Code)", 80],
          ["AI-assisted Builds", 70],
        ],
      },
    ],
    toolsLabel: "Daily tools",
    tools: [
      ["Webflow", 1],
      ["Figma", 1],
      ["Photoshop", 0],
      ["Illustrator", 0],
      ["Lightroom", 0],
      ["Premiere", 0],
      ["Claude Code", 1],
      ["VS Code", 0],
      ["Shopify", 0],
      ["Klaviyo", 0],
      ["Zapier", 0],
    ],
  },

  /* "How I can help" capabilities */
  services: {
    eyebrow: "Capabilities",
    titleHtml: 'How I can <span class="gold">help</span>',
    sub: "A quick map of where I am most useful - from brand and web design to photography and AI-assisted builds.",
    items: [
      {
        i: "Web Design & Build",
        h: "Websites, End to End",
        p: "From brief and wireframes to a shipped, responsive site - primarily in Webflow, increasingly with custom Claude-built features.",
      },
      {
        i: "Brand & Graphic Design",
        h: "Identity & Assets",
        p: "Branding, layout, and graphic design that stays clean, on-brand, and consistent across every touchpoint.",
      },
      {
        i: "Photography & Video",
        h: "Original Content",
        p: "Product, brand, and lifestyle photography and video, captured and edited to spec.",
      },
      {
        i: "AI-assisted Builds",
        h: "Building with Claude",
        p: "Functional prototypes and custom tools built in a Claude-native workflow - like the review tool at the bottom of this page.",
      },
    ],
  },

  /* Applicant Review Tool feature (bottom) */
  proof: {
    eyebrow: "Proof of work · built with Claude",
    titleHtml: 'The Applicant <span class="gold">Review Tool</span>',
    intro:
      "I would rather build than describe. So I made a working tool with Claude: drop in any candidate's documents and it grades them against a job posting, then answers questions about them. The grading runs on a transparent, not-rigged engine; Claude powers the conversational answers. It is my clearest piece of AI-assisted work, and it is live.",
    bullets: [
      "Drag-and-drop intake for PDF, DOCX, TXT and portfolio links, parsed in the browser",
      "Scores documents against a role across six categories",
      `Conversational "ask the application anything," powered by live Claude`,
      "Built end to end with Claude cowork + Claude Code, to my own design system",
    ],
    ctaLabel: "Open it Live",
    ctaHref: "/app/",
    image: "app-laptop.png",
    imageHref: "/app/",
  },

  /* Footer */
  footer: {
    nameHtml: 'William R.<br><span class="gold">Barton</span>',
    title: "Graphic & Web Designer",
    tag: "Brand, web, and an emerging Claude AI build workflow. Open to work and happy to talk.",
    contacts: [
      {
        label: "→ barton@bartosuerte.com",
        href: "mailto:barton@bartosuerte.com",
      },
      { label: "→ (512) 234-0620", href: "tel:+15122340620" },
      { label: "→ bartosuerte.com", href: "https://bartosuerte.com" },
      {
        label: "→ application review tool",
        href: "/app/",
      },
      {
        label: "→ linkedin.com/in/bartosuerte",
        href: "https://linkedin.com/in/bartosuerte",
      },
      { label: "→ Chattanooga, TN (EST) · He / Him", href: null, muted: true },
    ],
    meta: "Built with Claude",
    copyrightName: "William R. Barton",
  },
};
