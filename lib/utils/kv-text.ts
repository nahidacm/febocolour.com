/** Admin forms edit jsonb key/value fields (specifications, size chart) as plain
 *  "Key: Value" lines rather than a dynamic add/remove-row widget — much simpler
 *  to build and edit for a small catalog. */
export function parseKeyValueLines(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

export function formatKeyValueLines(obj: Record<string, string> | null | undefined): string {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}
