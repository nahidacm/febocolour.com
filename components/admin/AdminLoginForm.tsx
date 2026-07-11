"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminLoginAction, type AdminLoginState } from "@/lib/actions/admin-auth";

const initialState: AdminLoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-brand-lg bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-200 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLoginAction, initialState);

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
      <SubmitButton />
    </form>
  );
}
