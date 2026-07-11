import "server-only";
import { headers } from "next/headers";
import { db } from "@/lib/db/client";
import { auditLogs } from "@/lib/db/schema";

export async function writeAuditLog({
  adminUserId,
  action,
  entityType,
  entityId,
  changes,
}: {
  adminUserId: number | null;
  action: string;
  entityType: string;
  entityId?: string | number;
  changes?: Record<string, unknown>;
}) {
  const headerList = await headers();
  await db.insert(auditLogs).values({
    adminUserId,
    action,
    entityType,
    entityId: entityId !== undefined ? String(entityId) : null,
    changes,
    ipAddress: headerList.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: headerList.get("user-agent")?.slice(0, 255),
  });
}
