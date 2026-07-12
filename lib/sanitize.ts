import sanitizeHtml from "sanitize-html";

// Product descriptions are the only admin-authored field rendered via
// dangerouslySetInnerHTML on the public storefront — allowlist basic
// formatting only, strip everything else (scripts, styles, event handlers,
// iframes, etc.) so a compromised or malicious admin account can't stash
// stored XSS in a product page.
export function sanitizeDescriptionHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "em", "b", "i", "u", "ul", "ol", "li", "h3", "h4", "a", "span"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}
