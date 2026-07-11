"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateOrderStatusAction, type OrderStatusFormState } from "@/lib/actions/admin/orders";

const initialState: OrderStatusFormState = {};

const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];
const paymentStatuses = ["pending", "awaiting_verification", "paid", "failed", "refunded"];

export function OrderStatusForm({
  orderId,
  orderStatus,
  paymentStatus,
}: {
  orderId: number;
  orderStatus: string;
  paymentStatus: string;
}) {
  const [state, formAction] = useActionState(updateOrderStatusAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-4">
      <input type="hidden" name="id" value={orderId} />
      <div>
        <label htmlFor="orderStatus" className="text-sm font-medium text-foreground/80">
          Order Status
        </label>
        <select
          id="orderStatus"
          name="orderStatus"
          defaultValue={orderStatus}
          className="mt-1.5 rounded-brand-md border border-brand-200 bg-white px-3 py-2 text-sm capitalize"
        >
          {orderStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="paymentStatus" className="text-sm font-medium text-foreground/80">
          Payment Status
        </label>
        <select
          id="paymentStatus"
          name="paymentStatus"
          defaultValue={paymentStatus}
          className="mt-1.5 rounded-brand-md border border-brand-200 bg-white px-3 py-2 text-sm capitalize"
        >
          {paymentStatuses.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <SubmitButton>Update Status</SubmitButton>
      {state.success ? <span className="text-sm text-green-700">Updated</span> : null}
      {state.error ? <span className="text-sm text-red-600">{state.error}</span> : null}
    </form>
  );
}
