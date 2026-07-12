"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { customerRegisterAction, type CustomerAuthState } from "@/lib/actions/customer-auth";

const initialState: CustomerAuthState = {};

export function RegisterForm() {
  const [state, formAction] = useActionState(customerRegisterAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <FormField label="Full Name" name="fullName" required error={state.fieldErrors?.fullName} />
      <FormField label="Email" name="email" type="email" required error={state.fieldErrors?.email} />
      <FormField label="Phone Number" name="phone" type="tel" required error={state.fieldErrors?.phone} />
      <FormField
        label="Password"
        name="password"
        type="password"
        required
        error={state.fieldErrors?.password}
        placeholder="At least 8 characters"
      />
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton className="w-full">Create Account</SubmitButton>
      <p className="text-center text-sm text-foreground/60">
        Already have an account?{" "}
        <Link href="/account/login" className="font-medium text-brand-700 hover:text-brand-800">
          Sign in
        </Link>
      </p>
    </form>
  );
}
