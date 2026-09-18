import { defineArrayMember, defineType } from "sanity";

// The article body. Every block and inline object here already has CSS in the
// reference article mock — the port maps these to components, it does not
// design new ones.
export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // Blockquote renders as the pull quote in the article template.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto"] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "figure" }),
    defineArrayMember({ type: "callout" }),
    defineArrayMember({ type: "codeBlock" }),
    defineArrayMember({ type: "postReference" }),
  ],
});
