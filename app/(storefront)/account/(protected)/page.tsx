import Link from "next/link";
import { getCurrentCustomer } from "@/lib/auth/customer";
import { getCustomerOrders } from "@/lib/services/customers";

export default async function AccountOverviewPage() {
  const customer = await getCurrentCustomer();
  const orders = customer ? await getCustomerOrders(customer.id) : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Welcome back, {customer?.fullName}
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        You have {orders.length} order{orders.length === 1 ? "" : "s"} with us.
      </p>
      <Link
        href="/account/orders"
        className="mt-6 inline-block rounded-brand-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        View Orders
      </Link>
    </div>
  );
}
