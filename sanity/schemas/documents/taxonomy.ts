import { defineType } from "sanity";

// Fixed at four, one per capability. The colour maps to the design-system
// token and is passed down as --c, never hardcoded per component.
export const category = defineType({
  name: "category",
  title: "Category",
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
      name: "description",
      type: "text",
      description: "~30 words. Shown on the topic page.",
    },
    {
      name: "colour",
      type: "string",
      title: "Colour",
      options: {
        list: [
          { title: "Cyan — GTM Leadership", value: "cyan" },
          { title: "Green — Growth", value: "green" },
          { title: "Blue — Product", value: "blue" },
          { title: "Pink — Operational AI", value: "pink" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    },
    { name: "order", type: "number", initialValue: 0 },
  ],
  preview: { select: { title: "title", subtitle: "colour" } },
});

// Sub-filters on a topic page. Free-form and cheap.
export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: (rule) => rule.required() },
    {
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    },
  ],
});
