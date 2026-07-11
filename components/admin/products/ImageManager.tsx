import Image from "next/image";
import { Upload } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProductImageAction, uploadProductImageAction } from "@/lib/actions/admin/products";

export function ImageManager({
  productId,
  images,
}: {
  productId: number;
  images: { id: number; storageKey: string; isPrimary: boolean }[];
}) {
  const uploadAction = uploadProductImageAction.bind(null, productId);

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground">Images</h2>

      {images.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-brand-md border border-brand-100">
              <Image
                src={`/uploads/${image.storageKey}`}
                alt=""
                fill
                sizes="150px"
                className="object-cover"
              />
              {image.isPrimary ? (
                <span className="absolute top-1 left-1 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                  Primary
                </span>
              ) : null}
              <div className="absolute top-1 right-1 rounded-full bg-white/90 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <DeleteButton action={deleteProductImageAction.bind(null, image.id, productId)} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-foreground/60">No images yet.</p>
      )}

      <form action={uploadAction} className="mt-4 flex items-center gap-3">
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="text-sm text-foreground/70 file:mr-3 file:rounded-brand-sm file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-brand-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload
        </button>
      </form>
    </div>
  );
}
