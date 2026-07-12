import Link from "next/link";
import { Plus } from "lucide-react";
import { Table, Th, Td } from "@/components/admin/Table";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listShippingMethodsForAdmin } from "@/lib/services/admin/shipping";
import { deleteShippingMethodAction } from "@/lib/actions/admin/shipping";

export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const items = await listShippingMethodsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Shipping Methods</h1>
        <Link
          href="/admin/shipping/new"
          className="flex items-center gap-1.5 rounded-brand-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          New Method
        </Link>
      </div>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Code</Th>
              <Th>Rate</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {items.map((method) => (
              <tr key={method.id}>
                <Td>
                  <Link href={`/admin/shipping/${method.id}`} className="font-medium hover:text-brand-700">
                    {method.name}
                  </Link>
                </Td>
                <Td className="text-foreground/60">{method.code}</Td>
                <Td>
                  {method.rateType === "free"
                    ? "Free"
                    : method.rateType === "manual"
                      ? "Manual"
                      : `৳${Number(method.flatRate ?? 0).toLocaleString("en-US")}`}
                </Td>
                <Td>
                  <span
                    className={
                      method.isActive
                        ? "rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                        : "rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/60"
                    }
                  >
                    {method.isActive ? "Active" : "Inactive"}
                  </span>
                </Td>
                <Td className="text-right">
                  <DeleteButton action={deleteShippingMethodAction.bind(null, method.id)} confirmText={`Delete "${method.name}"?`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
