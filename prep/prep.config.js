/* ============================================================
   /prep nav config - the SINGLE SOURCE for the sidebar, page
   order, breadcrumbs, prev/next, and search. To add a page:
   drop a .md in content/ and add one line below.
   Each page: { title, slug, file, optional?, diagram? }
   - optional: render a clean "not written yet" state if the
     file is missing, and do not treat a 404 as an error.
   - diagram: key for a built-in diagram injected above the
     markdown (currently only "you-as-product").
   ============================================================ */
window.PREP = {
  title: "Interview Prep",
  subtitle: "FieldFlō Sr. Product Designer",
  // Date of the next live round, surfaced on the Overview page.
  nextRound: "CPO interview (Atul Kalantri), then a ~2hr case study",
  defaultSlug: "overview",
  nav: [
    {
      group: "Start here",
      pages: [
        { title: "Overview", slug: "overview", file: "overview.md" },
      ],
    },
    {
      group: "You",
      pages: [
        { title: "You as the Product", slug: "you-as-the-product", file: "candidate-profile.md", diagram: "you-as-product" },
        { title: "HR Screen Recap", slug: "hr-screen", file: "hr-screen.md" },
      ],
    },
    {
      group: "Design Fundamentals",
      pages: [
        { title: "Product Design Primer", slug: "design-fundamentals", file: "design-fundamentals.md" },
      ],
    },
    {
      group: "The Company",
      pages: [
        { title: "FieldFlō Profile", slug: "company-profile", file: "company-profile.md" },
        { title: "Our Story", slug: "our-story", file: "our-story.md" },
        { title: "Competitive Battlecard", slug: "competitive-battlecard", file: "competitive-battlecard.md" },
        { title: "Company Cheat Sheet", slug: "company-cheat-sheet", file: "company-cheat-sheet.md" },
      ],
    },
    {
      group: "The Role",
      pages: [
        { title: "Job Overview", slug: "the-role", file: "the-role.md" },
        { title: "JD Deep Dive", slug: "jd-deep-dive", file: "jd-deep-dive.md", optional: true },
      ],
    },
    {
      group: "Interviewers",
      pages: [
        { title: "Atul Kalantri (CPO)", slug: "interviewer-atul", file: "interviewer-atul.md" },
        { title: "Corey (Lead Designer)", slug: "interviewer-corey", file: "interviewer-corey.md", optional: true },
      ],
    },
    {
      group: "Interview Strategy",
      pages: [
        { title: "Game Plan", slug: "strategy", file: "strategy.md" },
      ],
    },
  ],
};
