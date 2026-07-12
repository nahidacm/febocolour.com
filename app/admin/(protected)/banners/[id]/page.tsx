import { notFound } from "next/navigation";
import { BannerForm } from "@/components/admin/banners/BannerForm";
import { getBannerForAdmin } from "@/lib/services/admin/banners";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBannerPage({ params }: PageProps) {
  const { id } = await params;
  const banner = await getBannerForAdmin(Number(id));
  if (!banner) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">{banner.title}</h1>
      <div className="mt-6">
        <BannerForm banner={banner} />
      </div>
    </div>
  );
}
