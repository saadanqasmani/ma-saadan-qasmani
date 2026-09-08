/**
 * Emits a schema.org graph as JSON-LD.
 *
 * The content is generated server-side from the site's own data, never from
 * user input, so serialising it into a script tag is safe. `<` is still
 * escaped, because a literal `</script>` inside a JSON string would end the
 * tag early and break the page.
 */
export function JsonLd({ data }: { data: Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data.length === 1 ? data[0] : data).replace(
          /</g,
          "\\u003c"
        ),
      }}
    />
  );
}
