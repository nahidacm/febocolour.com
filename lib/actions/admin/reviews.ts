"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/audit";
import { deleteReview, setReviewApproval } from "@/lib/services/admin/reviews";

export async function setReviewApprovalAction(id: number, isApproved: boolean) {
  const admin = await requireAdmin();
  await setReviewApproval(id, isApproved);
  await writeAuditLog({
    adminUserId: admin.id,
    action: isApproved ? "approve" : "unapprove",
    entityType: "review",
    entityId: id,
  });
  revalidatePath("/admin/reviews");
}

export async function deleteReviewAction(id: number) {
  const admin = await requireAdmin();
  await deleteReview(id);
  await writeAuditLog({
    adminUserId: admin.id,
    action: "delete",
    entityType: "review",
    entityId: id,
  });
  revalidatePath("/admin/reviews");
}
