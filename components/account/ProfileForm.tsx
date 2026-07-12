"use client";

import { useActionState } from "react";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateProfileAction, type ProfileFormState } from "@/lib/actions/customer";

const initialState: ProfileFormState = {};

export function ProfileForm({
  customer,
}: {
  customer: { fullName: string; phone: string | null; email: string | null };
}) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <FormField label="Full Name" name="fullName" defaultValue={customer.fullName} required />
      <FormField label="Phone" name="phone" type="tel" defaultValue={customer.phone ?? ""} required />
      <div>
        <label className="text-sm font-medium text-foreground/80">Email</label>
        <p className="mt-1.5 text-sm text-foreground/60">{customer.email ?? "—"}</p>
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>Save Changes</SubmitButton>
      {state.success ? <span className="ml-3 text-sm text-green-700">Saved</span> : null}
    </form>
  );
}
