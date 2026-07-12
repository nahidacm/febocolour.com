import Link from "next/link";
import { Plus } from "lucide-react";
import { Table, Th, Td } from "@/components/admin/Table";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listSocialLinksForAdmin } from "@/lib/services/admin/social-links";
import { deleteSocialLinkAction } from "@/lib/actions/admin/social-links";

export const dynamic = "force-dynamic";

export default async function AdminSocialLinksPage() {
  const items = await listSocialLinksForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Social Links
        </h1>
        <Link
          href="/admin/social-links/new"
          className="flex items-center gap-1.5 rounded-brand-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          New Link
        </Link>
      </div>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>Platform</Th>
              <Th>URL</Th>
              <Th>Status</Th>
              <Th>
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {items.map((link) => (
              <tr key={link.id}>
                <Td>
                  <Link
                    href={`/admin/social-links/${link.id}`}
                    className="font-medium hover:text-brand-700"
                  >
                    {link.platform}
                  </Link>
                </Td>
                <Td className="text-foreground/60">{link.url}</Td>
                <Td>
                  <span
                    className={
                      link.isActive
                        ? "rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                        : "rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/70"
                    }
                  >
                    {link.isActive ? "Active" : "Inactive"}
                  </span>
                </Td>
                <Td className="text-right">
                  <DeleteButton
                    action={deleteSocialLinkAction.bind(null, link.id)}
                    confirmText={`Delete "${link.platform}"?`}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/60">
            No social links yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
