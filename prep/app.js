/* ============================================================
   /prep - client-side docs renderer.
   Zero build. Reads window.PREP (prep.config.js), fetches the
   Markdown for a route, renders with marked + DOMPurify, and
   builds the sidebar, breadcrumb, on-this-page TOC, prev/next,
   search, and the mobile drawer. Hash routing: #/<slug>[~<headingId>].
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.PREP || { nav: [], defaultSlug: "overview" };
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CALLOUT_LABELS = {
    note: "Note", tip: "Tip", warning: "Warning",
    important: "Important", caution: "Caution",
  };

  // ---- flat page list (order = sidebar order) ----
  var PAGES = [];
  CFG.nav.forEach(function (grp) {
    (grp.pages || []).forEach(function (p) {
      PAGES.push({
        title: p.title, slug: p.slug, file: p.file,
        group: grp.group, optional: !!p.optional, diagram: p.diagram || null,
      });
    });
  });
  function pageBySlug(slug) {
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].slug === slug) return PAGES[i];
    return null;
  }

  // ---- tiny utils ----
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function slugify(s) {
    return String(s).toLowerCase().trim()
      .replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  function smoothScrollTo(node) {
    if (!node) return;
    node.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
  }

  // ---- front-matter (very small YAML subset: key: value lines) ----
  function parseFrontMatter(raw) {
    var meta = {}, body = raw;
    if (raw.slice(0, 3) === "---") {
      var end = raw.indexOf("\n---", 3);
      if (end !== -1) {
        var block = raw.slice(3, end);
        body = raw.slice(end + 4).replace(/^\s*\n/, "");
        block.split("\n").forEach(function (line) {
          var m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
          if (m) meta[m[1]] = m[2].replace(/^["']|["']$/g, "");
        });
      }
    }
    return { meta: meta, body: body };
  }

  // ---- markdown -> safe HTML ----
  function renderMarkdown(md) {
    if (window.marked && typeof window.marked.setOptions === "function") {
      window.marked.setOptions({ gfm: true, breaks: false });
    }
    var dirty = window.marked ? window.marked.parse(md) : md;
    return window.DOMPurify ? window.DOMPurify.sanitize(dirty) : dirty;
  }

  // ---- DOM enhancement after render ----
  function uniqueId(used, base) {
    var id = base || "section", n = 2;
    while (!id || used[id]) { id = (base || "section") + "-" + n; n++; }
    used[id] = true;
    return id;
  }

  function enhance(container) {
    var headings = [];
    var used = {};

    // heading ids + hover anchors (h2/h3 feed the TOC)
    container.querySelectorAll("h2, h3").forEach(function (h) {
      var id = uniqueId(used, slugify(h.textContent));
      h.id = id;
      h.classList.add("doc-heading");
      var a = el("a", "heading-anchor");
      a.href = "#/" + currentSlug + "~" + id;
      a.setAttribute("aria-label", "Link to this section");
      a.innerHTML = "#";
      a.addEventListener("click", function (e) {
        e.preventDefault();
        history.replaceState(null, "", "#/" + currentSlug + "~" + id);
        smoothScrollTo(h);
      });
      h.appendChild(a);
      headings.push({ id: id, level: h.tagName === "H2" ? 2 : 3, text: h.textContent.replace(/#$/, "").trim() });
    });

    // GitHub-style callouts: > [!NOTE] / [!TIP] / [!WARNING] / ...
    container.querySelectorAll("blockquote").forEach(function (bq) {
      var m = bq.textContent.match(/^\s*\[!(\w+)\]/);
      if (!m) return;
      var type = m[1].toLowerCase();
      if (!CALLOUT_LABELS[type]) type = "note";
      var firstP = bq.querySelector("p");
      if (firstP) firstP.innerHTML = firstP.innerHTML.replace(/^\s*\[!\w+\]\s*(<br\s*\/?>)?\s*/i, "");
      var card = el("div", "callout callout-" + type);
      card.appendChild(el("div", "callout-label", CALLOUT_LABELS[type]));
      var body = el("div", "callout-body");
      while (bq.firstChild) body.appendChild(bq.firstChild);
      card.appendChild(body);
      bq.replaceWith(card);
    });

    // tables -> horizontally scrollable on small screens
    container.querySelectorAll("table").forEach(function (t) {
      if (t.parentElement && t.parentElement.classList.contains("table-wrap")) return;
      var wrap = el("div", "table-wrap");
      t.replaceWith(wrap);
      wrap.appendChild(t);
    });

    // links: pdf/doc -> download card; external -> new tab
    container.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (/\.(pdf|docx?|pptx?|xlsx?)(\?.*)?$/i.test(href)) {
        a.classList.add("download-card");
        a.setAttribute("download", "");
        var ext = (href.split(".").pop() || "file").split("?")[0].toUpperCase();
        var label = el("span", "dl-meta");
        label.appendChild(el("span", "dl-icon", "↓"));
        var txt = el("span", "dl-text");
        txt.appendChild(el("span", "dl-title", a.textContent));
        txt.appendChild(el("span", "dl-sub", ext + " · download"));
        label.appendChild(txt);
        a.textContent = "";
        a.appendChild(label);
      } else if (/^https?:\/\//i.test(href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
    });

    return headings;
  }

  // ---- "You as the Product" diagram (vertical Double Diamond) ----
  function buildDiagram(kind) {
    if (kind !== "you-as-product") return null;
    var stages = [
      { eyebrow: "Discover · diverge", title: "The raw material", points: [
        "15 years, many hats, a digital problem solver",
        "The market's real pain: field adoption fails in this category",
      ] },
      { eyebrow: "Define · converge", title: "The reframe", points: [
        "Product design is what I have been doing all along",
        "The 3 JD asks: AI components, multi-role workflows, real-world complexity",
      ] },
      { eyebrow: "Develop · diverge", title: "The proof", points: [
        "Applicant Review Tool: AI-UX decisions, transparent scoring, live Claude",
        "Humble and Fume rebuild: Webflow, Klaviyo, Zapier into NetSuite, +20% online sales",
      ] },
      { eyebrow: "Deliver · converge", title: "The close", points: [
        "Why FieldFlō, AI-native, visibly more productive on day one",
      ] },
    ];
    var wrap = el("section", "ladder");
    wrap.setAttribute("aria-label", "You as the product: the design process applied to the candidate");
    var head = el("div", "ladder-head");
    head.appendChild(el("div", "eyebrow", "You as the product"));
    head.appendChild(el("div", "ladder-sub", "The same design process, applied to the candidate. Every answer ladders back to one north star."));
    wrap.appendChild(head);

    stages.forEach(function (s, i) {
      var card = el("div", "stage");
      card.appendChild(el("div", "stage-eyebrow", s.eyebrow));
      card.appendChild(el("div", "stage-title", s.title));
      var ul = el("ul", "stage-points");
      s.points.forEach(function (p) { ul.appendChild(el("li", null, p)); });
      card.appendChild(ul);
      wrap.appendChild(card);
      if (i < stages.length - 1) wrap.appendChild(el("div", "stage-link", "↓"));
    });

    var bar = el("div", "quality-bar");
    bar.appendChild(el("div", "qb-label", "Quality bar"));
    bar.appendChild(el("div", "qb-text", "Rams' 10 principles and Nielsen's heuristics: how a senior designer judges the work, across all four stages."));
    wrap.appendChild(bar);
    return wrap;
  }

  // ---- sidebar ----
  var sidebarEl, scrimEl;
  function buildSidebar() {
    sidebarEl.innerHTML = "";
    CFG.nav.forEach(function (grp) {
      var section = el("div", "nav-group");
      var head = el("button", "nav-group-head");
      head.type = "button";
      head.setAttribute("aria-expanded", "true");
      head.appendChild(el("span", "nav-group-title", grp.group));
      head.appendChild(el("span", "nav-group-chev", "▾"));
      var list = el("div", "nav-group-list");
      head.addEventListener("click", function () {
        var open = section.classList.toggle("collapsed");
        head.setAttribute("aria-expanded", open ? "false" : "true");
      });
      (grp.pages || []).forEach(function (p) {
        var a = el("a", "nav-link");
        a.href = "#/" + p.slug;
        a.dataset.slug = p.slug;
        a.appendChild(el("span", "nav-link-text", p.title));
        if (p.optional) a.appendChild(el("span", "nav-badge", "draft"));
        a.addEventListener("click", closeDrawer);
        list.appendChild(a);
      });
      section.appendChild(head);
      section.appendChild(list);
      sidebarEl.appendChild(section);
    });
  }
  function setActiveNav(slug) {
    sidebarEl.querySelectorAll(".nav-link").forEach(function (a) {
      a.classList.toggle("active", a.dataset.slug === slug);
    });
  }

  // ---- mobile drawer ----
  function openDrawer() {
    document.body.classList.add("drawer-open");
    if (scrimEl) scrimEl.classList.add("show");
    var ham = document.getElementById("hamburger");
    if (ham) ham.setAttribute("aria-expanded", "true");
    var first = sidebarEl && sidebarEl.querySelector(".nav-link");
    if (first) first.focus();
  }
  function closeDrawer() {
    var wasOpen = document.body.classList.contains("drawer-open");
    document.body.classList.remove("drawer-open");
    if (scrimEl) scrimEl.classList.remove("show");
    var ham = document.getElementById("hamburger");
    if (ham) {
      ham.setAttribute("aria-expanded", "false");
      // return focus to the toggle only if focus was inside the drawer
      if (wasOpen && document.activeElement && sidebarEl && sidebarEl.contains(document.activeElement)) ham.focus();
    }
  }

  // ---- on-this-page TOC + scroll-spy ----
  var spyObserver = null;
  function buildTOC(headings) {
    var toc = document.getElementById("toc");
    var tocMobile = document.getElementById("tocMobile");
    var lists = [document.getElementById("tocList"), document.getElementById("tocMobileList")].filter(Boolean);
    if (!lists.length) return;
    lists.forEach(function (l) { l.innerHTML = ""; });
    if (spyObserver) { spyObserver.disconnect(); spyObserver = null; }
    var usable = headings.filter(function (h) { return h.level === 2 || h.level === 3; });
    if (usable.length < 2) {
      if (toc) toc.hidden = true;
      if (tocMobile) tocMobile.hidden = true;
      return;
    }
    if (toc) toc.hidden = false;
    if (tocMobile) { tocMobile.hidden = false; tocMobile.open = false; }

    usable.forEach(function (h) {
      lists.forEach(function (list) {
        var a = el("a", "toc-link toc-l" + h.level, h.text);
        a.href = "#/" + currentSlug + "~" + h.id;
        a.dataset.target = h.id;
        a.addEventListener("click", function (e) {
          e.preventDefault();
          history.replaceState(null, "", "#/" + currentSlug + "~" + h.id);
          smoothScrollTo(document.getElementById(h.id));
          closeMobileToc();
        });
        list.appendChild(a);
      });
    });

    // scroll-spy: drive the active state on every .toc-link (desktop + mobile)
    var visible = {};
    function setActive(activeId) {
      lists.forEach(function (list) {
        list.querySelectorAll(".toc-link").forEach(function (a) {
          a.classList.toggle("active", a.dataset.target === activeId);
        });
      });
    }
    spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visible[en.target.id] = true; else delete visible[en.target.id];
      });
      var firstVisible = usable.filter(function (h) { return visible[h.id]; })[0];
      setActive(firstVisible ? firstVisible.id : null);
    }, { rootMargin: "-72px 0px -70% 0px", threshold: 0 });
    usable.forEach(function (h) {
      var node = document.getElementById(h.id);
      if (node) spyObserver.observe(node);
    });
  }
  function closeMobileToc() {
    var mt = document.getElementById("tocMobile");
    if (mt) mt.open = false;
  }

  // ---- breadcrumb + prev/next ----
  function buildBreadcrumb(page, meta) {
    var bc = document.getElementById("breadcrumb");
    if (!bc) return;
    bc.innerHTML = "";
    bc.appendChild(el("span", "crumb-group", page.group));
    bc.appendChild(el("span", "crumb-sep", "/"));
    bc.appendChild(el("span", "crumb-page", page.title));
    var upd = document.getElementById("updated");
    if (upd) {
      if (meta && meta.updated) { upd.hidden = false; upd.textContent = "Updated " + meta.updated; }
      else upd.hidden = true;
    }
  }
  function buildPager(page) {
    var pager = document.getElementById("pager");
    if (!pager) return;
    pager.innerHTML = "";
    var idx = PAGES.indexOf(page);
    var prev = idx > 0 ? PAGES[idx - 1] : null;
    var next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
    function card(p, dir) {
      var a = el("a", "pager-card pager-" + dir);
      a.href = "#/" + p.slug;
      a.appendChild(el("span", "pager-dir", dir === "prev" ? "Previous" : "Next"));
      a.appendChild(el("span", "pager-title", p.title));
      return a;
    }
    if (prev) pager.appendChild(card(prev, "prev")); else pager.appendChild(el("span", "pager-spacer"));
    if (next) pager.appendChild(card(next, "next")); else pager.appendChild(el("span", "pager-spacer"));
  }

  // ---- empty / error states ----
  function emptyState(page, kind) {
    var d = el("div", "empty-state");
    d.appendChild(el("div", "empty-glyph", kind === "error" ? "!" : "✎"));
    d.appendChild(el("h1", null, page.title));
    if (kind === "error") {
      d.appendChild(el("p", null, "This page could not be loaded, possibly a dropped connection. Check your signal and try again."));
      var btn = el("button", "retry-btn", "Try again");
      btn.type = "button";
      btn.addEventListener("click", function () { render(page, parseHash()); });
      d.appendChild(btn);
    } else {
      d.appendChild(el("p", null, "Not written yet. This page is planned but the notes have not been added. Drop content/" + page.file + " in and it will appear here automatically."));
    }
    return d;
  }

  // ---- router ----
  var currentSlug = null;
  function safeDecode(s) {
    try { return decodeURIComponent(s); } catch (e) { return s; }
  }
  function parseHash() {
    var h = location.hash || "";
    var raw = h.replace(/^#\/?/, "");
    var parts = raw.split("~");
    return { slug: safeDecode(parts[0] || ""), heading: parts[1] ? safeDecode(parts[1]) : null };
  }

  function render(page, route) {
    var token = page.slug; // guard against a slow fetch overwriting a newer page
    var article = document.getElementById("article");
    document.getElementById("searchOverlay").classList.remove("open");

    fetch("content/" + page.file, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (raw) {
        if (token !== currentSlug) return; // user already navigated away
        var fm = parseFrontMatter(raw);
        article.innerHTML = "";
        var diag = buildDiagram(page.diagram);
        if (diag) article.appendChild(diag);
        var body = el("div", "markdown-body");
        body.innerHTML = renderMarkdown(fm.body);
        var headings = enhance(body);
        article.appendChild(body);
        buildBreadcrumb(page, fm.meta);
        buildPager(page);
        buildTOC(headings);
        afterRender(route);
      })
      .catch(function (e) {
        // optional pages 404 by design (graceful draft state); only log genuine failures
        if (!page.optional) { try { console.error("[prep load error]", page.slug, e && (e.message || e)); } catch (x) {} }
        if (token !== currentSlug) return;
        article.innerHTML = "";
        article.appendChild(emptyState(page, page.optional ? "draft" : "error"));
        buildBreadcrumb(page, null);
        buildPager(page);
        buildTOC([]);
        afterRender(route);
      });
  }

  function afterRender(route) {
    if (route && route.heading) {
      var node = document.getElementById(route.heading);
      // load-time deep link: jump instantly (no long smooth-scroll on arrival)
      if (node) { node.scrollIntoView({ behavior: "auto", block: "start" }); return; }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function route() {
    var r = parseHash();
    var slug = r.slug || CFG.defaultSlug;
    var page = pageBySlug(slug);
    if (!page) { location.replace("#/" + CFG.defaultSlug); return; }
    var samePage = page.slug === currentSlug;
    setActiveNav(page.slug);
    document.title = page.title + " · " + (CFG.title || "Prep");
    if (samePage) { afterRender(r); return; } // only a heading jump
    currentSlug = page.slug;
    render(page, r);
  }

  // ---- search ----
  var searchIndex = null, indexBuilding = false;
  function mdToText(md) {
    return md
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^>\s?/gm, "")
      .replace(/[*_~`>#|]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function buildSearchIndex() {
    if (searchIndex || indexBuilding) return;
    indexBuilding = true;
    var entries = [];
    var queue = PAGES.slice();
    // Fetch sequentially (one at a time) so warming the index never stampedes
    // the server or a weak mobile connection, and never starves a page fetch.
    function next() {
      if (!queue.length) { searchIndex = entries; indexBuilding = false; refreshSearch(); return; }
      var p = queue.shift();
      fetch("content/" + p.file, { cache: "no-cache" })
        .then(function (r) { return r.ok ? r.text() : ""; })
        .then(function (raw) {
          if (raw) {
            var fm = parseFrontMatter(raw);
            var heads = [];
            var usedIds = {}; // mirror enhance()'s dedup so deep-link ids match the rendered DOM
            fm.body.replace(/```[\s\S]*?```/g, "").replace(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm, function (_, hash, t) {
              heads.push({ text: t.trim(), id: uniqueId(usedIds, slugify(t.trim())) });
              return _;
            });
            entries.push({ slug: p.slug, title: p.title, group: p.group, headings: heads, text: mdToText(fm.body).toLowerCase() });
          }
        })
        .catch(function () {})
        .then(next);
    }
    next();
  }
  function runSearch(q) {
    q = (q || "").trim().toLowerCase();
    if (!q || !searchIndex) return [];
    var terms = q.split(/\s+/).filter(Boolean);
    var out = [];
    searchIndex.forEach(function (e) {
      var score = 0, matchedHeading = null;
      var titleL = e.title.toLowerCase();
      terms.forEach(function (t) {
        if (titleL.indexOf(t) !== -1) score += 6;
        e.headings.forEach(function (h) {
          if (h.text.toLowerCase().indexOf(t) !== -1) { score += 3; if (!matchedHeading) matchedHeading = h; }
        });
        var idx = e.text.indexOf(t);
        if (idx !== -1) score += 1;
      });
      if (score > 0) out.push({ entry: e, score: score, heading: matchedHeading });
    });
    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, 12);
  }
  function refreshSearch() {
    var input = document.getElementById("searchInput");
    if (input && document.getElementById("searchOverlay").classList.contains("open")) renderResults(input.value);
  }
  function renderResults(q) {
    var box = document.getElementById("searchResults");
    box.innerHTML = "";
    if (!searchIndex) { box.appendChild(el("div", "search-hint", "Indexing pages...")); buildSearchIndex(); return; }
    if (!q || !q.trim()) { box.appendChild(el("div", "search-hint", "Type to search every page.")); return; }
    var results = runSearch(q);
    if (!results.length) { box.appendChild(el("div", "search-hint", "No matches for “" + q + "”.")); return; }
    results.forEach(function (res) {
      var a = el("a", "search-result");
      a.href = "#/" + res.entry.slug + (res.heading ? "~" + res.heading.id : "");
      a.appendChild(el("span", "sr-group", res.entry.group));
      a.appendChild(el("span", "sr-title", res.entry.title));
      if (res.heading) a.appendChild(el("span", "sr-heading", res.heading.text));
      a.addEventListener("click", closeSearch);
      box.appendChild(a);
    });
  }
  var lastFocusedBeforeSearch = null;
  function openSearch() {
    var ov = document.getElementById("searchOverlay");
    lastFocusedBeforeSearch = document.activeElement;
    ov.classList.add("open");
    document.body.classList.add("search-open");
    buildSearchIndex();
    var input = document.getElementById("searchInput");
    renderResults(input.value);
    setTimeout(function () { input.focus(); input.select(); }, 20);
  }
  function closeSearch() {
    document.getElementById("searchOverlay").classList.remove("open");
    document.body.classList.remove("search-open");
    if (lastFocusedBeforeSearch && lastFocusedBeforeSearch.focus) lastFocusedBeforeSearch.focus();
  }
  function trapTabInOverlay(e) {
    var ov = document.getElementById("searchOverlay");
    var nodes = ov.querySelectorAll("input, button, a[href]");
    var f = Array.prototype.filter.call(nodes, function (n) { return n.offsetParent !== null || n === document.activeElement; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ---- boot ----
  function boot() {
    sidebarEl = document.getElementById("sidebar");
    scrimEl = document.getElementById("scrim");
    buildSidebar();

    document.getElementById("hamburger").addEventListener("click", openDrawer);
    scrimEl.addEventListener("click", closeDrawer);

    var openers = document.querySelectorAll("[data-open-search]");
    openers.forEach(function (b) { b.addEventListener("click", openSearch); });
    document.getElementById("searchClose").addEventListener("click", closeSearch);
    document.getElementById("searchOverlay").addEventListener("click", function (e) {
      if (e.target === this) closeSearch();
    });
    var input = document.getElementById("searchInput");
    input.addEventListener("input", function () { renderResults(input.value); });

    document.addEventListener("keydown", function (e) {
      var searchOpen = document.getElementById("searchOverlay").classList.contains("open");
      if (e.key === "/" && !searchOpen && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
        e.preventDefault(); openSearch();
      } else if (e.key === "Escape") {
        closeSearch(); closeDrawer();
      } else if (e.key === "Tab" && searchOpen) {
        trapTabInOverlay(e);
      }
    });

    window.addEventListener("hashchange", route);
    if (!location.hash) location.replace("#/" + CFG.defaultSlug);
    route();
    // warm the search index shortly after first paint
    setTimeout(buildSearchIndex, 600);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
