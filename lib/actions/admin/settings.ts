"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/audit";
import { saveSettings, SETTINGS_KEYS } from "@/lib/services/admin/settings";

export type SettingsFormState = { success?: boolean };

export async function saveSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const admin = await requireAdmin();

  const values: Record<string, string> = {};
  for (const key of SETTINGS_KEYS) {
    values[key] = formData.get(key)?.toString() ?? "";
  }

  await saveSettings(values);
  await writeAuditLog({ adminUserId: admin.id, action: "update", entityType: "settings" });

  revalidatePath("/admin/settings");
  // Phone/WhatsApp/Messenger render in the storefront's shared layout (Header, Footer,
  // FloatingContactButtons) and the root layout's JSON-LD — busting just "/" wouldn't
  // touch the ISR-cached category/product pages that also render that layout.
  revalidatePath("/", "layout");
  return { success: true };
}
