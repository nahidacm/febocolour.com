"use client";

import { useActionState } from "react";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveSettingsAction, type SettingsFormState } from "@/lib/actions/admin/settings";
import type { SettingsMap } from "@/lib/services/admin/settings";

const initialState: SettingsFormState = {};

export function SettingsForm({ settings }: { settings: SettingsMap }) {
  const [state, formAction] = useActionState(saveSettingsAction, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Store Phone" name="store_phone" defaultValue={settings.store_phone ?? ""} />
      <FormField label="WhatsApp URL" name="whatsapp_url" defaultValue={settings.whatsapp_url ?? ""} />
      <FormField label="Messenger URL" name="messenger_url" defaultValue={settings.messenger_url ?? ""} />
      <FormField
        label="Order Notification Email"
        name="notification_email"
        type="email"
        defaultValue={settings.notification_email ?? ""}
      />
      <FormField
        label="Free Shipping Threshold (৳, optional)"
        name="free_shipping_threshold"
        type="number"
        defaultValue={settings.free_shipping_threshold ?? ""}
      />
      <SubmitButton>Save Settings</SubmitButton>
      {state.success ? <span className="ml-3 text-sm text-green-700">Saved</span> : null}
    </form>
  );
}
