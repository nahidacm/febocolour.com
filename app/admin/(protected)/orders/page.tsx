import { getAllOrders } from "@/lib/services/orders";

export const dynamic = "force-dynamic";

// Bare, unauthenticated read-only view — just enough to confirm Phase 2 orders land
// correctly in the DB. Phase 3 replaces this with the real admin_users-guarded layout.
export default async function AdminOrdersPage() {
  const allOrders = await getAllOrders();

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Orders ({allOrders.length})</h1>
      <table style={{ marginTop: 16, borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
            <th style={{ padding: "8px 12px" }}>Order #</th>
            <th style={{ padding: "8px 12px" }}>Customer</th>
            <th style={{ padding: "8px 12px" }}>Phone</th>
            <th style={{ padding: "8px 12px" }}>Items</th>
            <th style={{ padding: "8px 12px" }}>Shipping</th>
            <th style={{ padding: "8px 12px" }}>Payment</th>
            <th style={{ padding: "8px 12px" }}>Total</th>
            <th style={{ padding: "8px 12px" }}>Status</th>
            <th style={{ padding: "8px 12px" }}>Placed</th>
          </tr>
        </thead>
        <tbody>
          {allOrders.map((order) => (
            <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px 12px", fontWeight: 600 }}>{order.orderNumber}</td>
              <td style={{ padding: "8px 12px" }}>{order.shippingFullName}</td>
              <td style={{ padding: "8px 12px" }}>{order.shippingPhone}</td>
              <td style={{ padding: "8px 12px" }}>
                {order.items.map((i) => `${i.productNameSnapshot} x${i.quantity}`).join(", ")}
              </td>
              <td style={{ padding: "8px 12px" }}>{order.shippingMethod.name}</td>
              <td style={{ padding: "8px 12px" }}>{order.paymentMethod.name}</td>
              <td style={{ padding: "8px 12px" }}>৳{Number(order.total).toLocaleString("en-US")}</td>
              <td style={{ padding: "8px 12px" }}>
                {order.orderStatus} / {order.paymentStatus}
              </td>
              <td style={{ padding: "8px 12px" }}>{new Date(order.placedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {allOrders.length === 0 ? <p style={{ marginTop: 16 }}>No orders yet.</p> : null}
    </div>
  );
}
