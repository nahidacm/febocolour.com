"use client";

import { useActionState } from "react";
import { FormField, FormTextarea, FormSelect, FormCheckbox } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveShippingMethodAction, type ShippingFormState } from "@/lib/actions/admin/shipping";

const initialState: ShippingFormState = {};

export function ShippingMethodForm({
  method,
}: {
  method?: {
    id: number;
    code: string;
    name: string;
    description: string | null;
    rateType: string;
    flatRate: string | null;
    sortOrder: number;
    isActive: boolean;
  };
}) {
  const [state, formAction] = useActionState(saveShippingMethodAction, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {method ? <input type="hidden" name="id" value={method.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Code" name="code" defaultValue={method?.code} required error={state.fieldErrors?.code} />
        <FormField label="Name" name="name" defaultValue={method?.name} required error={state.fieldErrors?.name} />
      </div>
      <FormTextarea label="Description" name="description" defaultValue={method?.description ?? ""} rows={2} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelect
          label="Rate Type"
          name="rateType"
          defaultValue={method?.rateType ?? "flat"}
          options={[
            { value: "flat", label: "Flat Rate" },
            { value: "free", label: "Free" },
            { value: "manual", label: "Manual (quoted separately)" },
          ]}
        />
        <FormField
          label="Flat Rate (৳)"
          name="flatRate"
          type="number"
          step="0.01"
          defaultValue={method?.flatRate ?? ""}
        />
      </div>
      <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={method?.sortOrder ?? 0} />
      <FormCheckbox label="Active" name="isActive" defaultChecked={method?.isActive ?? true} />
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>{method ? "Save Changes" : "Create Shipping Method"}</SubmitButton>
    </form>
  );
}
