import { cache } from "react";
import { inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { siteConfig } from "@/lib/site-config";

export type SiteContactInfo = {
  phone: string;
  whatsappUrl: string;
  messengerUrl: string;
};

const CONTACT_KEYS = ["store_phone", "whatsapp_url", "messenger_url"] as const;

/**
 * Public-facing (non-admin) read of the contact fields the admin Settings page manages.
 * Falls back to lib/site-config.ts's static defaults for any key not yet set — so the
 * site never shows a blank phone number/link before an admin fills one in.
 * Wrapped in React's cache() so Header/Footer/FloatingContactButtons/the root layout
 * (which all need this) share one query per request instead of one each.
 */
export const getSiteContactInfo = cache(async (): Promise<SiteContactInfo> => {
  const rows = await db.query.siteSettings.findMany({
    where: inArray(siteSettings.key, CONTACT_KEYS),
  });
  const map = new Map(rows.map((row) => [row.key, typeof row.value === "string" ? row.value : String(row.value)]));

  return {
    phone: map.get("store_phone") || siteConfig.phone,
    whatsappUrl: map.get("whatsapp_url") || siteConfig.whatsappUrl,
    messengerUrl: map.get("messenger_url") || siteConfig.messengerUrl,
  };
});
