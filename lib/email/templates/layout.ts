export function emailLayout({ title, bodyHtml }: { title: string; bodyHtml: string }): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#fef1f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#ec377f;padding:20px 32px;">
                <span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">FeboColour</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#241522;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#fef1f6;color:#7c737a;font-size:12px;">
                FeboColour — Hijab &amp; Abaya for Every Age
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function orderItemsTableHtml(items: { name: string; variantLabel: string | null; quantity: number; lineTotal: number }[]) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #fcdeea;font-size:14px;">
            ${item.name}${item.variantLabel ? `<br/><span style="color:#7c737a;font-size:12px;">${item.variantLabel}</span>` : ""}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #fcdeea;font-size:14px;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #fcdeea;font-size:14px;text-align:right;">৳${item.lineTotal.toLocaleString("en-US")}</td>
        </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
    <thead>
      <tr>
        <th style="text-align:left;font-size:12px;color:#7c737a;padding-bottom:6px;">Item</th>
        <th style="text-align:center;font-size:12px;color:#7c737a;padding-bottom:6px;">Qty</th>
        <th style="text-align:right;font-size:12px;color:#7c737a;padding-bottom:6px;">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}
