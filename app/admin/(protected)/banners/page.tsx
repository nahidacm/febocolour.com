import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Table, Th, Td } from "@/components/admin/Table";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listBannersForAdmin } from "@/lib/services/admin/banners";
import { deleteBannerAction } from "@/lib/actions/admin/banners";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const items = await listBannersForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Homepage Banners
        </h1>
        <Link
          href="/admin/banners/new"
          className="flex items-center gap-1.5 rounded-brand-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          New Banner
        </Link>
      </div>
      <p className="mt-1 text-sm text-foreground/60">
        The top active banner (by sort order) is shown as the homepage hero.
      </p>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>
                <span className="sr-only">Image</span>
              </Th>
              <Th>Title</Th>
              <Th>Sort</Th>
              <Th>Status</Th>
              <Th>
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {items.map((banner) => (
              <tr key={banner.id}>
                <Td className="w-14">
                  {banner.image ? (
                    <div className="relative h-10 w-16 overflow-hidden rounded-brand-sm">
                      <Image
                        src={`/uploads/${banner.image}`}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-16 rounded-brand-sm bg-brand-50" />
                  )}
                </Td>
                <Td>
                  <Link
                    href={`/admin/banners/${banner.id}`}
                    className="font-medium hover:text-brand-700"
                  >
                    {banner.title}
                  </Link>
                </Td>
                <Td className="text-foreground/60">{banner.sortOrder}</Td>
                <Td>
                  <span
                    className={
                      banner.isActive
                        ? "rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                        : "rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/70"
                    }
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </Td>
                <Td className="text-right">
                  <DeleteButton
                    action={deleteBannerAction.bind(null, banner.id)}
                    confirmText={`Delete "${banner.title}"?`}
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
