import { defineType } from "sanity";

// Initials are stored, not derived — two-word surnames behave differently.
export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    { name: "name", type: "string", validation: (rule) => rule.required() },
    {
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    },
    { name: "role", type: "string" },
    { name: "bio", type: "text" },
    {
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    },
    { name: "initials", type: "string", validation: (rule) => rule.max(3) },
    { name: "linkedIn", type: "url", title: "LinkedIn" },
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
