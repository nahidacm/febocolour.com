import { notFound } from "next/navigation";
import { SocialLinkForm } from "@/components/admin/social-links/SocialLinkForm";
import { getSocialLinkForAdmin } from "@/lib/services/admin/social-links";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditSocialLinkPage({ params }: PageProps) {
  const { id } = await params;
  const link = await getSocialLinkForAdmin(Number(id));
  if (!link) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">{link.platform}</h1>
      <div className="mt-6">
        <SocialLinkForm link={link} />
      </div>
    </div>
  );
}
