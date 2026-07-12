import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Table, Th, Td } from "@/components/admin/Table";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listProductsForAdmin } from "@/lib/services/admin/products";
import { deleteProductAction } from "@/lib/actions/admin/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const items = await listProductsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Products ({items.length})
        </h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-brand-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          New Product
        </Link>
      </div>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>
                <span className="sr-only">Image</span>
              </Th>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th>Status</Th>
              <Th>
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.id}>
                <Td className="w-14">
                  {product.images[0] ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-brand-sm">
                      <Image
                        src={`/uploads/${product.images[0].storageKey}`}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-brand-sm bg-brand-50" />
                  )}
                </Td>
                <Td>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium hover:text-brand-700"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-foreground/70">{product.sku}</p>
                </Td>
                <Td>{product.category?.name ?? "—"}</Td>
                <Td>৳{Number(product.regularPrice).toLocaleString("en-US")}</Td>
                <Td>{product.stockQuantity}</Td>
                <Td>
                  <span
                    className={
                      product.isActive
                        ? "rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                        : "rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/70"
                    }
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </Td>
                <Td className="text-right">
                  <DeleteButton
                    action={deleteProductAction.bind(null, product.id)}
                    confirmText={`Delete "${product.name}"?`}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
