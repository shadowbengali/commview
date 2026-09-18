import { defineType } from "sanity";

// The article. readTime is intentionally NOT stored — it is computed from the
// body at query time so it can never go stale.
export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    {
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(70),
    },
    {
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    },
    {
      name: "standfirst",
      type: "text",
      title: "Standfirst",
      description: "120–200 characters. Doubles as the meta description.",
      validation: (rule) => rule.required().min(120).max(200),
    },
    {
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    },
    {
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    },
    {
      name: "tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
    {
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    },
    {
      name: "publishedAt",
      type: "datetime",
      validation: (rule) => rule.required(),
    },
    { name: "body", type: "blockContent" },
    {
      name: "takeaways",
      type: "array",
      title: "Takeaways",
      description: "2–4 points. Renders the 'In short' box and feeds answer engines.",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(2).max(4),
    },
    {
      name: "faqs",
      type: "array",
      title: "FAQs",
      of: [{ type: "faq" }],
    },
    {
      name: "featured",
      type: "boolean",
      description: "One featured post leads the index.",
      initialValue: false,
    },
    {
      name: "relatedPosts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    },
    { name: "seo", type: "seo" },
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "publishedAt" },
  },
});
