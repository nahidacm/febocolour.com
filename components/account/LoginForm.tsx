"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { customerLoginAction, type CustomerAuthState } from "@/lib/actions/customer-auth";

const initialState: CustomerAuthState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(customerLoginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground/80">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1.5 w-full rounded-brand-md border border-brand-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-foreground/80">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-brand-md border border-brand-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
        />
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton className="w-full">Sign In</SubmitButton>
      <p className="text-center text-sm text-foreground/60">
        No account?{" "}
        <Link href="/account/register" className="font-medium text-brand-700 hover:text-brand-800">
          Create one
        </Link>
      </p>
    </form>
  );
}
