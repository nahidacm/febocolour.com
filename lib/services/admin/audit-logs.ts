import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { auditLogs } from "@/lib/db/schema";

export async function listAuditLogsForAdmin(limit = 100) {
  return db.query.auditLogs.findMany({
    orderBy: desc(auditLogs.createdAt),
    limit,
    with: { adminUser: { columns: { fullName: true, email: true } } },
  });
}
