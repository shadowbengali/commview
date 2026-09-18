# COMMVIEW — sitemap & IA decisions

These decisions revise the sitemap in `BUILD-PLAN.md`. They come from the SEO/IA
plan in `commview_page_briefs.docx` (per-page briefs: H1, H2s + keywords, meta,
CTAs, internal links, schema, FAQ) and `commview_sitemap_and_blog_plan.xlsx`
(full ~55-page inventory, the 20-question blog plan, publishing sequence).

## Decisions (2026-09-18)

1. **Insights, not blog.** The section lives at **`/insights`** with
   `/insights/[slug]` and `/insights/category/[pillar]`. `/blog` was live briefly
   and now 301-redirects to `/insights` (see `next.config.ts`). Visible nav label
   stays **"Insight"**.
2. **Pillar URLs — Option A: SEO-first URL, brand nav label.**
   - GTM Leadership → **`/fractional-cmo`**
   - Growth → **`/growth`**
   - Product → **`/product-strategy`**
   - Operational AI → **`/ai-consulting`**
   Nav shows the brand term; the URL/H1 target the searchable keyword.
3. **Deep nesting.** Pillars have sub-pillars, segments and geo pages up to three
   levels, e.g. `/growth/seo/b2b`, `/growth/aeo/services`, `/fractional-cmo/for-startups`.
   Planned approach: a `servicePage` Sanity type resolved by a catch-all route.
4. **Body copy is written by the client in Studio.** Templates + structure
   (H1, H2 headings, meta, FAQ questions from the briefs) are built in code; the
   prose is authored per page in Sanity. Never invent copy — use visible `TODO:`
   placeholders where words don't exist yet.
5. **Build page-by-page.** No bulk build; each page is built and verified as we go,
   following the publishing sequence in the workbook.

## What's built so far

Homepage (locked copy, ported), `/insights` index, `/insights/[slug]` article.
Sanity content model: post, category (4 pillars), tag, author, page, siteSettings.

## Still to build (from the inventory)

Service pillar/sub-service pages (`servicePage` + catch-all route), `/insights/category/[pillar]`,
`/what-we-do`, `/how-we-work`, `/about`, `/work` + case studies, `/contact`,
`/diagnostic`, `/agencies`, legal, mega-menu nav. See the xlsx **Full Page Inventory**
for the complete list, template per page, FAQ requirement and phase.
