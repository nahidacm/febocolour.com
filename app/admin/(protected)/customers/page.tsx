import Link from "next/link";
import { Table, Th, Td } from "@/components/admin/Table";
import { listCustomersForAdmin } from "@/lib/services/admin/customers";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const items = await listCustomersForAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Customers ({items.length})</h1>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Orders</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((customer) => (
              <tr key={customer.id}>
                <Td>
                  <Link href={`/admin/customers/${customer.id}`} className="font-medium hover:text-brand-700">
                    {customer.fullName}
                  </Link>
                </Td>
                <Td className="text-foreground/60">{customer.email ?? "—"}</Td>
                <Td className="text-foreground/60">{customer.phone ?? "—"}</Td>
                <Td>{customer.orders.length}</Td>
                <Td className="text-foreground/60">{new Date(customer.createdAt).toLocaleDateString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/60">
            No registered customers yet — orders can also be placed as a guest.
          </p>
        ) : null}
      </div>
    </div>
  );
}
