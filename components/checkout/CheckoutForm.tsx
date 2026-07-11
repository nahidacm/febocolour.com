"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useCart } from "@/components/storefront/CartProvider";
import { ShippingMethodSelect, type ShippingMethodOption } from "@/components/checkout/ShippingMethodSelect";
import { PaymentMethodSelect, type PaymentMethodOption } from "@/components/checkout/PaymentMethodSelect";
import { placeOrderAction, type CheckoutFormState } from "@/lib/actions/checkout";

function formatTaka(amount: number) {
  return `৳${amount.toLocaleString("en-US")}`;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-brand-lg bg-brand-600 py-3 text-sm font-semibold text-white shadow-md shadow-brand-200 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Placing Order..." : "Place Order"}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground/80">
        {label}
        {required ? <span className="text-brand-600"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-brand-md border border-brand-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

const initialState: CheckoutFormState = {};

export function CheckoutForm({
  shippingMethods,
  paymentMethods,
}: {
  shippingMethods: ShippingMethodOption[];
  paymentMethods: PaymentMethodOption[];
}) {
  const { items, subtotal, loading } = useCart();
  const [state, formAction] = useActionState(placeOrderAction, initialState);
  const [shippingCode, setShippingCode] = useState(shippingMethods[0]?.code ?? "");
  const [paymentCode, setPaymentCode] = useState(paymentMethods[0]?.code ?? "");

  const shippingCost = useMemo(() => {
    const method = shippingMethods.find((m) => m.code === shippingCode);
    if (!method) return 0;
    return method.rateType === "free" ? 0 : Number(method.flatRate ?? 0);
  }, [shippingCode, shippingMethods]);

  if (!loading && items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-sm text-foreground/60">Add something to your cart before checking out.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-brand-lg bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-brand-200 transition-colors hover:bg-brand-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const total = subtotal + shippingCost;

  return (
    <form action={formAction} className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">Contact & Delivery</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="fullName" required error={state.fieldErrors?.fullName} />
            <Field label="Phone Number" name="phone" type="tel" required error={state.fieldErrors?.phone} />
            <div className="sm:col-span-2">
              <Field
                label="Email (optional — for order confirmation)"
                name="email"
                type="email"
                error={state.fieldErrors?.email}
              />
            </div>
            <div className="sm:col-span-2">
              <Field label="Full Address" name="addressLine" required error={state.fieldErrors?.addressLine} />
            </div>
            <Field label="City" name="city" required error={state.fieldErrors?.city} />
            <Field label="Area (optional)" name="area" />
            <Field label="Postal Code (optional)" name="postalCode" />
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">Shipping Method</h2>
          <div className="mt-4">
            <ShippingMethodSelect
              methods={shippingMethods}
              selected={shippingCode}
              onChange={setShippingCode}
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">Payment Method</h2>
          <div className="mt-4">
            <PaymentMethodSelect methods={paymentMethods} selected={paymentCode} onChange={setPaymentCode} />
          </div>
        </section>

        <section>
          <label htmlFor="notes" className="text-sm font-medium text-foreground/80">
            Order Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Delivery instructions, gift note, etc."
            className="mt-1.5 w-full rounded-brand-md border border-brand-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
          />
        </section>
      </div>

      <div className="h-fit rounded-brand-lg border border-brand-100 bg-brand-50/50 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Order Summary</h2>
        {loading ? (
          <div className="mt-4 animate-pulse space-y-2" aria-hidden="true">
            <div className="h-4 rounded bg-brand-100" />
            <div className="h-4 w-2/3 rounded bg-brand-100" />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-xs text-foreground/70">
                <span className="pr-2">
                  {item.productName}
                  {item.variantLabel ? ` (${item.variantLabel})` : ""} &times; {item.quantity}
                </span>
                <span className="shrink-0">{formatTaka(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 space-y-1.5 border-t border-brand-100 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/70">Subtotal</span>
            <span>{formatTaka(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/70">Shipping</span>
            <span>{formatTaka(shippingCost)}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-semibold text-brand-700">
            <span>Total</span>
            <span>{formatTaka(total)}</span>
          </div>
        </div>

        {state.error ? <p className="mt-4 text-sm text-red-600">{state.error}</p> : null}
        <SubmitButton />
      </div>
    </form>
  );
}
