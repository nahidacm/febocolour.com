"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export function VerifyPaymentButton({ action }: { action: () => Promise<unknown> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Mark this payment as verified? This sets the order's payment status to Paid.")) return;
        startTransition(async () => {
          await action();
          router.refresh();
        });
      }}
      className="flex items-center gap-1.5 rounded-brand-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <CheckCircle2 className="h-3.5 w-3.5" />
      {isPending ? "Verifying..." : "Verify Payment"}
    </button>
  );
}
