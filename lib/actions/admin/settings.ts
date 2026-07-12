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
  return { success: true };
}
