import { defineType } from "sanity";

// Image + caption + alt. Alt is required as a Sanity validation rule, not left
// to editors — accessibility is enforced at the source.
export const figure = defineType({
  name: "figure",
  title: "Figure",
  type: "image",
  options: { hotspot: true },
  fields: [
    {
      name: "alt",
      type: "string",
      title: "Alt text",
      description: "Describe the image for screen readers and search.",
      validation: (rule) => rule.required(),
    },
    { name: "caption", type: "string", title: "Caption" },
  ],
});

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    { name: "label", type: "string", title: "Label" },
    {
      name: "text",
      type: "text",
      title: "Text",
      validation: (rule) => rule.required(),
    },
  ],
});

export const codeBlock = defineType({
  name: "codeBlock",
  title: "Code block",
  type: "object",
  fields: [
    { name: "language", type: "string", title: "Language" },
    {
      name: "code",
      type: "text",
      title: "Code",
      validation: (rule) => rule.required(),
    },
  ],
});

// An inline link to another post that renders as a card in the body.
export const postReference = defineType({
  name: "postReference",
  title: "Post reference",
  type: "object",
  fields: [
    {
      name: "post",
      type: "reference",
      to: [{ type: "post" }],
      validation: (rule) => rule.required(),
    },
  ],
});
