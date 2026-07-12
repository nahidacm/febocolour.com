"use client";

import { useActionState } from "react";
import { FormField, FormCheckbox } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveSocialLinkAction, type SocialLinkFormState } from "@/lib/actions/admin/social-links";

const initialState: SocialLinkFormState = {};

export function SocialLinkForm({
  link,
}: {
  link?: { id: number; platform: string; url: string; sortOrder: number; isActive: boolean };
}) {
  const [state, formAction] = useActionState(saveSocialLinkAction, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {link ? <input type="hidden" name="id" value={link.id} /> : null}
      <FormField label="Platform" name="platform" defaultValue={link?.platform} required error={state.fieldErrors?.platform} placeholder="Facebook, Instagram, YouTube..." />
      <FormField label="URL" name="url" defaultValue={link?.url} required error={state.fieldErrors?.url} />
      <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={link?.sortOrder ?? 0} />
      <FormCheckbox label="Active" name="isActive" defaultChecked={link?.isActive ?? true} />
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>{link ? "Save Changes" : "Create Social Link"}</SubmitButton>
    </form>
  );
}
