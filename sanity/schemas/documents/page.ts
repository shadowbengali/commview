import { defineType } from "sanity";

// Service pages (/what-we-do, /how-we-work, /about). Composed from section
// objects so editors cannot break the design system.
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: (rule) => rule.required() },
    {
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    },
    {
      name: "sections",
      type: "array",
      of: [{ type: "contentSection" }],
    },
    { name: "seo", type: "seo" },
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
