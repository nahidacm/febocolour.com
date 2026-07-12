"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Truck, RefreshCw } from "lucide-react";
import { refreshSteadfastStatusAction, sendOrderToSteadfastAction } from "@/lib/actions/admin/orders";

export function SteadfastPanel({
  orderId,
  courierTrackingCode,
  courierTrackingLink,
  courierStatus,
  courierSentAt,
}: {
  orderId: number;
  courierTrackingCode: string | null;
  courierTrackingLink: string | null;
  courierStatus: string | null;
  courierSentAt: Date | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runAction(action: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-brand-lg border border-brand-100 bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-foreground">Steadfast Courier</h2>

      {courierTrackingCode ? (
        <div className="mt-3 space-y-1.5 text-sm text-foreground/70">
          <p>
            <span className="font-medium text-foreground">Tracking Code:</span>{" "}
            {courierTrackingLink ? (
              <a
                href={courierTrackingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline hover:text-brand-800"
              >
                {courierTrackingCode}
              </a>
            ) : (
              courierTrackingCode
            )}
          </p>
          <p>
            <span className="font-medium text-foreground">Status:</span>{" "}
            <span className="capitalize">{courierStatus?.replace(/_/g, " ") ?? "unknown"}</span>
          </p>
          {courierSentAt ? (
            <p className="text-xs text-foreground/60">
              Sent {new Date(courierSentAt).toLocaleString()}
            </p>
          ) : null}
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(refreshSteadfastStatusAction.bind(null, orderId))}
            className="mt-2 flex items-center gap-1.5 rounded-brand-md border border-brand-200 px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {isPending ? "Refreshing..." : "Refresh Status"}
          </button>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-sm text-foreground/60">Not yet sent to Steadfast for delivery.</p>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(sendOrderToSteadfastAction.bind(null, orderId))}
            className="mt-3 flex items-center gap-1.5 rounded-brand-md bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Truck className="h-3.5 w-3.5" />
            {isPending ? "Sending..." : "Send to Steadfast"}
          </button>
        </div>
      )}

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
