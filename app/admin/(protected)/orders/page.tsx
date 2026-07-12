import Link from "next/link";
import { Table, Th, Td } from "@/components/admin/Table";
import { getAllOrders } from "@/lib/services/orders";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-foreground/10 text-foreground/70",
};

export default async function AdminOrdersPage() {
  const items = await getAllOrders();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Orders ({items.length})
      </h1>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>Order #</Th>
              <Th>Customer</Th>
              <Th>Shipping</Th>
              <Th>Payment</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Placed</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((order) => (
              <tr key={order.id}>
                <Td>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium hover:text-brand-700"
                  >
                    {order.orderNumber}
                  </Link>
                </Td>
                <Td>
                  {order.shippingFullName}
                  <p className="text-xs text-foreground/70">
                    {order.shippingPhone}
                  </p>
                </Td>
                <Td className="text-foreground/60">
                  {order.shippingMethod.name}
                </Td>
                <Td className="text-foreground/60">
                  {order.paymentMethod.name}
                </Td>
                <Td>৳{Number(order.total).toLocaleString("en-US")}</Td>
                <Td>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[order.orderStatus] ?? ""}`}
                  >
                    {order.orderStatus}
                  </span>
                </Td>
                <Td className="text-foreground/60">
                  {new Date(order.placedAt).toLocaleDateString()}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/60">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
