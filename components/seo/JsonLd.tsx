export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // JSON.stringify doesn't escape "</script>" — if any field (e.g. an admin-entered
  // product name) contains that literal sequence, it would close this script tag early
  // and let arbitrary markup execute. Escaping "<" breaks that sequence without
  // affecting how the JSON parses.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
