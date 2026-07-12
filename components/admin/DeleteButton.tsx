"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  confirmText = "Delete this item? This cannot be undone.",
}: {
  action: () => Promise<unknown>;
  confirmText?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      aria-label="Delete"
      onClick={() => {
        if (!confirm(confirmText)) return;
        startTransition(async () => {
          await action();
          router.refresh();
        });
      }}
      className="text-foreground/70 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
