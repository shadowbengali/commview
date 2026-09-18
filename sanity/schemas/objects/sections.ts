import { defineType } from "sanity";

// Service pages are composed from a small set of section types rather than
// free Portable Text, so they cannot drift off the design system. Phase 2
// adds the richer section variants; this is the baseline.
export const contentSection = defineType({
  name: "contentSection",
  title: "Content section",
  type: "object",
  fields: [
    { name: "eyebrow", type: "string", title: "Eyebrow" },
    { name: "heading", type: "string", title: "Heading" },
    { name: "body", type: "blockContent", title: "Body" },
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Content section",
      subtitle,
    }),
  },
});
