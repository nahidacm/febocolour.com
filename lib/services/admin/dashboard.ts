import { and, desc, eq, gte, sql, sum } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orderItems, orders, products } from "@/lib/db/schema";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getTodaysStats() {
  const [row] = await db
    .select({
      orderCount: sql<number>`count(*)`.mapWith(Number),
      revenue: sql<string>`coalesce(sum(${orders.total}), 0)`,
    })
    .from(orders)
    .where(gte(orders.placedAt, startOfToday()));

  return { orderCount: row?.orderCount ?? 0, revenue: Number(row?.revenue ?? 0) };
}

export async function getBestSellingProducts(limit = 5) {
  return db
    .select({
      productId: orderItems.productId,
      name: sql<string>`max(${orderItems.productNameSnapshot})`,
      totalSold: sum(orderItems.quantity).mapWith(Number),
    })
    .from(orderItems)
    .groupBy(orderItems.productId)
    .orderBy(desc(sum(orderItems.quantity)))
    .limit(limit);
}

export async function getLowStockItems(threshold = 5, limit = 8) {
  return db.query.products.findMany({
    where: and(eq(products.isActive, true)),
    orderBy: (p, { asc }) => asc(p.stockQuantity),
    limit,
    columns: { id: true, name: true, sku: true, stockQuantity: true },
  }).then((rows) => rows.filter((r) => r.stockQuantity <= threshold));
}

export async function getRecentOrders(limit = 8) {
  return db.query.orders.findMany({
    orderBy: desc(orders.createdAt),
    limit,
    columns: { id: true, orderNumber: true, shippingFullName: true, total: true, orderStatus: true, placedAt: true },
  });
}
