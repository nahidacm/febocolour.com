"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteReviewAction, setReviewApprovalAction } from "@/lib/actions/admin/reviews";

export function ReviewActions({ id, isApproved }: { id: number; isApproved: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await setReviewApprovalAction(id, !isApproved);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={toggle}
        className={
          isApproved
            ? "text-sm font-medium text-foreground/60 hover:text-red-600"
            : "text-sm font-medium text-green-700 hover:text-green-800"
        }
      >
        {isApproved ? "Unapprove" : "Approve"}
      </button>
      <DeleteButton action={deleteReviewAction.bind(null, id)} confirmText="Delete this review?" />
    </div>
  );
}
