import { integer, jsonb, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { adminUsers } from "@/lib/db/schema/auth";

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminUserId: integer("admin_user_id").references(() => adminUsers.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 60 }).notNull(),
  entityId: varchar("entity_id", { length: 60 }),
  changes: jsonb("changes").$type<Record<string, unknown>>(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: varchar("user_agent", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
