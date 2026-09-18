import { defineType } from "sanity";

// SEO override object, attached to posts and pages.
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    {
      name: "title",
      type: "string",
      title: "Meta title",
      description: "Overrides the document title in search results. Max 60.",
      validation: (rule) => rule.max(60),
    },
    {
      name: "description",
      type: "text",
      title: "Meta description",
      validation: (rule) => rule.max(160),
    },
    { name: "ogImage", type: "image", title: "Social share image" },
    {
      name: "noIndex",
      type: "boolean",
      title: "Hide from search engines",
      initialValue: false,
    },
  ],
});

// A question/answer pair. Renders the FAQ block and the FAQPage schema.
export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    {
      name: "question",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "answer",
      type: "text",
      validation: (rule) => rule.required(),
    },
  ],
  preview: { select: { title: "question" } },
});
