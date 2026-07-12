import Link from "next/link";
import { getCurrentCustomer } from "@/lib/auth/customer";
import { getCustomerOrders } from "@/lib/services/customers";

export default async function AccountOrdersPage() {
  const customer = await getCurrentCustomer();
  const orders = customer ? await getCustomerOrders(customer.id) : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-foreground/60">
          No orders yet.{" "}
          <Link href="/" className="font-medium text-brand-700 hover:text-brand-800">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.orderNumber}`}
                className="flex items-center justify-between rounded-brand-lg border border-brand-100 bg-white p-4 hover:border-brand-300"
              >
                <div>
                  <p className="font-medium text-foreground/90">{order.orderNumber}</p>
                  <p className="text-xs text-foreground/50">
                    {new Date(order.placedAt).toLocaleDateString()} · {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand-700">৳{Number(order.total).toLocaleString("en-US")}</p>
                  <p className="text-xs capitalize text-foreground/50">{order.orderStatus}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
