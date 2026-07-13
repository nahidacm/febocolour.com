import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { getAllSettings } from "@/lib/services/admin/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAllSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Settings</h1>
      <p className="mt-1 max-w-xl text-sm text-foreground/60">
        Phone, WhatsApp, and Messenger changes apply across the storefront immediately
        after saving.
      </p>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
