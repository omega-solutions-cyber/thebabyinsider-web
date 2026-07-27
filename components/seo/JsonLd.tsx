/**
 * Emits a JSON-LD graph. React 19 hoists the script into <head> automatically.
 *
 * The `<` escape prevents a `</script>` sequence inside any string value from
 * closing the tag early.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
