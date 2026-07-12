import Link from "next/link";
import { Table, Th, Td } from "@/components/admin/Table";
import { listInventoryForAdmin } from "@/lib/services/admin/inventory";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const items = await listInventoryForAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Inventory</h1>
      <p className="mt-1 text-sm text-foreground/60">Sorted by stock, lowest first. Edit stock from the product page.</p>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th>Stock</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.key}>
                <Td>
                  <Link href={`/admin/products/${item.productId}`} className="font-medium hover:text-brand-700">
                    {item.productName}
                  </Link>
                  {item.variantLabel ? <p className="text-xs text-foreground/50">{item.variantLabel}</p> : null}
                </Td>
                <Td className="text-foreground/60">{item.sku}</Td>
                <Td className={item.stockQuantity <= 5 ? "font-semibold text-red-600" : undefined}>
                  {item.stockQuantity}
                </Td>
                <Td>
                  <span
                    className={
                      item.stockStatus === "in_stock"
                        ? "rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                        : item.stockStatus === "backorder"
                          ? "rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                          : "rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                    }
                  >
                    {item.stockStatus.replace("_", " ")}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
