import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/services/catalog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "FeboColour product";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductOgImage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const name = product?.name ?? "FeboColour";
  const price = product ? Number(product.regularPrice) : null;
  const onSale = !!product?.salePrice;
  const displayPrice = onSale ? Number(product!.salePrice) : price;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #ec377f 0%, #a424ff 100%)",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 4,
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          FeboColour
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 68,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            display: "flex",
            lineHeight: 1.15,
          }}
        >
          {name}
        </div>
        {displayPrice ? (
          <div
            style={{
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: "#ffffff",
                display: "flex",
              }}
            >
              {/* Satori's default font has no Bengali glyph coverage — ৳ renders as a
                  broken tofu box here even though the browser renders it fine everywhere
                  else on the site. "Tk" is the safe ASCII fallback for this generated image. */}
              Tk {displayPrice.toLocaleString("en-US")}
            </div>
            {onSale ? (
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#ffffff",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "8px 20px",
                  borderRadius: 999,
                  display: "flex",
                }}
              >
                SALE
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
