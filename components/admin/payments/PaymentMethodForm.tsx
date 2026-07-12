"use client";

import { useActionState } from "react";
import { FormField, FormTextarea, FormCheckbox } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { savePaymentMethodAction, type PaymentFormState } from "@/lib/actions/admin/payments";

const initialState: PaymentFormState = {};

export function PaymentMethodForm({
  method,
}: {
  method?: {
    id: number;
    code: string;
    name: string;
    instructions: string | null;
    sortOrder: number;
    requiresManualVerification: boolean;
    isActive: boolean;
  };
}) {
  const [state, formAction] = useActionState(savePaymentMethodAction, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {method ? <input type="hidden" name="id" value={method.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Code" name="code" defaultValue={method?.code} required error={state.fieldErrors?.code} />
        <FormField label="Name" name="name" defaultValue={method?.name} required error={state.fieldErrors?.name} />
      </div>
      <FormTextarea
        label="Instructions (shown to customer at checkout)"
        name="instructions"
        defaultValue={method?.instructions ?? ""}
        rows={3}
      />
      <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={method?.sortOrder ?? 0} />
      <div className="flex flex-wrap gap-6">
        <FormCheckbox label="Active" name="isActive" defaultChecked={method?.isActive ?? false} />
        <FormCheckbox
          label="Requires manual verification"
          name="requiresManualVerification"
          defaultChecked={method?.requiresManualVerification ?? false}
        />
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>{method ? "Save Changes" : "Create Payment Method"}</SubmitButton>
    </form>
  );
}
