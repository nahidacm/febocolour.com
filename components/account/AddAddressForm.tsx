"use client";

import { useActionState } from "react";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { addAddressAction, type AddressFormState } from "@/lib/actions/customer";

const initialState: AddressFormState = {};

export function AddAddressForm() {
  const [state, formAction] = useActionState(addAddressAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <FormField label="Label (e.g. Home, Office)" name="label" />
      <div />
      <FormField label="Full Name" name="fullName" required />
      <FormField label="Phone" name="phone" type="tel" required />
      <div className="sm:col-span-2">
        <FormField label="Address" name="addressLine" required />
      </div>
      <FormField label="City" name="city" required />
      <FormField label="Area (optional)" name="area" />
      <FormField label="Postal Code (optional)" name="postalCode" />
      {state.error ? <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p> : null}
      <div className="sm:col-span-2">
        <SubmitButton>Add Address</SubmitButton>
      </div>
    </form>
  );
}
