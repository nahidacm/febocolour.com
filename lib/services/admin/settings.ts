import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";

export const SETTINGS_KEYS = [
  "store_phone",
  "whatsapp_url",
  "messenger_url",
  "notification_email",
  "free_shipping_threshold",
] as const;

export type SettingsMap = Partial<Record<(typeof SETTINGS_KEYS)[number], string>>;

export async function getAllSettings(): Promise<SettingsMap> {
  const rows = await db.query.siteSettings.findMany();
  const map: SettingsMap = {};
  for (const row of rows) {
    if ((SETTINGS_KEYS as readonly string[]).includes(row.key)) {
      map[row.key as keyof SettingsMap] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
    }
  }
  return map;
}

export async function saveSettings(values: SettingsMap) {
  for (const key of SETTINGS_KEYS) {
    const value = values[key];
    if (value === undefined) continue;
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      });
  }
}
