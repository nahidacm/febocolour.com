import { Table, Th, Td } from "@/components/admin/Table";
import { listAuditLogsForAdmin } from "@/lib/services/admin/audit-logs";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const items = await listAuditLogsForAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Audit Logs
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        Most recent {items.length} admin actions.
      </p>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>Admin</Th>
              <Th>Action</Th>
              <Th>Entity</Th>
              <Th>Details</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((log) => (
              <tr key={log.id}>
                <Td className="text-foreground/60">
                  {new Date(log.createdAt).toLocaleString()}
                </Td>
                <Td>{log.adminUser?.fullName ?? "—"}</Td>
                <Td className="capitalize">{log.action.replace("_", " ")}</Td>
                <Td className="text-foreground/60">
                  {log.entityType}
                  {log.entityId ? ` #${log.entityId}` : ""}
                </Td>
                <Td className="max-w-xs truncate text-foreground/70">
                  {log.changes ? JSON.stringify(log.changes) : ""}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/60">No activity yet.</p>
        ) : null}
      </div>
    </div>
  );
}
