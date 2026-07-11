import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerForAdmin } from "@/lib/services/admin/customers";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const customer = await getCustomerForAdmin(Number(id));
  if (!customer) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-foreground">{customer.fullName}</h1>
      <p className="mt-1 text-sm text-foreground/60">
        {customer.email ?? "No email"} · {customer.phone ?? "No phone"} · Joined{" "}
        {new Date(customer.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-brand-lg border border-brand-100 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Addresses</h2>
          {customer.addresses.length === 0 ? (
            <p className="mt-2 text-sm text-foreground/60">No saved addresses.</p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm text-foreground/70">
              {customer.addresses.map((addr) => (
                <li key={addr.id}>
                  {addr.label ? <span className="font-medium text-foreground">{addr.label}: </span> : null}
                  {addr.addressLine}, {addr.city}
                  {addr.area ? `, ${addr.area}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-brand-lg border border-brand-100 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Orders ({customer.orders.length})</h2>
          {customer.orders.length === 0 ? (
            <p className="mt-2 text-sm text-foreground/60">No orders yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {customer.orders.map((order) => (
                <li key={order.id}>
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-700 hover:text-brand-800">
                    {order.orderNumber}
                  </Link>
                  <span className="ml-2 text-foreground/60">
                    ৳{Number(order.total).toLocaleString("en-US")} — {order.orderStatus}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
