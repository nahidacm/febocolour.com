import Link from "next/link";
import { ClipboardList, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import {
  getBestSellingProducts,
  getLowStockItems,
  getRecentOrders,
  getTodaysStats,
} from "@/lib/services/admin/dashboard";

export const dynamic = "force-dynamic";

function formatTaka(amount: number) {
  return `৳${amount.toLocaleString("en-US")}`;
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ClipboardList;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-brand-lg border border-brand-100 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-foreground/50">{label}</p>
          <p className="text-xl font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [todayStats, bestSellers, lowStock, recentOrders] = await Promise.all([
    getTodaysStats(),
    getBestSellingProducts(),
    getLowStockItems(),
    getRecentOrders(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Today's Orders" value={String(todayStats.orderCount)} />
        <StatCard icon={DollarSign} label="Today's Revenue" value={formatTaka(todayStats.revenue)} />
        <StatCard icon={TrendingUp} label="Best Seller" value={bestSellers[0]?.name ?? "—"} />
        <StatCard icon={AlertTriangle} label="Low Stock Items" value={String(lowStock.length)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-brand-lg border border-brand-100 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Best Selling Products</h2>
          {bestSellers.length === 0 ? (
            <p className="mt-2 text-sm text-foreground/60">No sales data yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {bestSellers.map((item) => (
                <li key={item.productId ?? item.name} className="flex justify-between">
                  <span className="text-foreground/80">{item.name}</span>
                  <span className="text-foreground/50">{item.totalSold} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-brand-lg border border-brand-100 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Low Stock</h2>
          {lowStock.length === 0 ? (
            <p className="mt-2 text-sm text-foreground/60">Nothing low on stock right now.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {lowStock.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <Link href={`/admin/products/${item.id}`} className="text-foreground/80 hover:text-brand-700">
                    {item.name}
                  </Link>
                  <span className="font-medium text-red-600">{item.stockQuantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-brand-lg border border-brand-100 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="mt-2 text-sm text-foreground/60">No orders yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex justify-between">
                <Link href={`/admin/orders/${order.id}`} className="text-brand-700 hover:text-brand-800">
                  {order.orderNumber}
                </Link>
                <span className="text-foreground/60">{order.shippingFullName}</span>
                <span className="capitalize text-foreground/60">{order.orderStatus}</span>
                <span className="font-medium">{formatTaka(Number(order.total))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
