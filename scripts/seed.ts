import "@/scripts/load-env";

import { db } from "@/lib/db/client";
import {
  adminUsers,
  attributes,
  attributeValues,
  categories,
  homepageBanners,
  paymentMethodConfigs,
  productAttributes,
  productVariants,
  productVariantValues,
  products,
  reviews,
  shippingMethodConfigs,
} from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";

async function truncateAll() {
  await db.execute(sql`
    TRUNCATE TABLE
      audit_logs,
      admin_sessions,
      admin_users,
      customer_sessions,
      addresses,
      reviews,
      order_payment_details,
      order_items,
      orders,
      customers,
      cart_items,
      carts,
      product_variant_values,
      product_variants,
      product_attributes,
      attribute_values,
      attributes,
      product_videos,
      product_images,
      products,
      categories,
      homepage_banners,
      social_links,
      site_settings,
      shipping_method_configs,
      payment_method_configs
    RESTART IDENTITY CASCADE
  `);
}

function cartesian<T>(groups: T[][]): T[][] {
  return groups.reduce<T[][]>(
    (acc, group) => acc.flatMap((combo) => group.map((item) => [...combo, item])),
    [[]],
  );
}

async function main() {
  console.log("Seeding database...");
  await truncateAll();

  // ---- Categories ------------------------------------------------------
  const [hijab, abaya, babyGirlHijab, accessories] = await db
    .insert(categories)
    .values([
      { name: "Hijab", slug: "hijab", description: "Everyday and premium hijabs for women of all ages.", sortOrder: 1 },
      { name: "Abaya", slug: "abaya", description: "Elegant, modest abayas.", sortOrder: 2 },
      { name: "Baby Girl Hijab", slug: "baby-girl-hijab", description: "Soft, safe hijabs made especially for baby girls.", sortOrder: 3 },
      { name: "Accessories", slug: "accessories", description: "Pins, caps and hijab accessories.", sortOrder: 4 },
    ])
    .returning();

  const [instantHijabCat, chiffonHijabCat, jerseyHijabCat] = await db
    .insert(categories)
    .values([
      { parentId: hijab.id, name: "Instant Hijab", slug: "instant-hijab", sortOrder: 1 },
      { parentId: hijab.id, name: "Chiffon Hijab", slug: "chiffon-hijab", sortOrder: 2 },
      { parentId: hijab.id, name: "Jersey Hijab", slug: "jersey-hijab", sortOrder: 3 },
    ])
    .returning();

  const [classicAbayaCat, embroideredAbayaCat] = await db
    .insert(categories)
    .values([
      { parentId: abaya.id, name: "Classic Abaya", slug: "classic-abaya", sortOrder: 1 },
      { parentId: abaya.id, name: "Embroidered Abaya", slug: "embroidered-abaya", sortOrder: 2 },
    ])
    .returning();

  const [babyInstantHijabCat, babyHijabSetsCat] = await db
    .insert(categories)
    .values([
      { parentId: babyGirlHijab.id, name: "Baby Instant Hijab", slug: "baby-instant-hijab", sortOrder: 1 },
      { parentId: babyGirlHijab.id, name: "Baby Hijab Sets", slug: "baby-hijab-sets", sortOrder: 2 },
    ])
    .returning();

  // ---- Attributes --------------------------------------------------------
  const [colorAttr, sizeAttr, ageAttr] = await db
    .insert(attributes)
    .values([
      { name: "Color", slug: "color", inputType: "color_swatch", sortOrder: 1 },
      { name: "Size", slug: "size", inputType: "select", sortOrder: 2 },
      { name: "Age Range", slug: "age-range", inputType: "select", sortOrder: 3 },
    ])
    .returning();

  const colorValues = await db
    .insert(attributeValues)
    .values([
      { attributeId: colorAttr.id, value: "Baby Pink", slug: "baby-pink", swatchHex: "#F9A8D4", sortOrder: 1 },
      { attributeId: colorAttr.id, value: "Black", slug: "black", swatchHex: "#1A1A1A", sortOrder: 2 },
      { attributeId: colorAttr.id, value: "White", slug: "white", swatchHex: "#FFFFFF", sortOrder: 3 },
      { attributeId: colorAttr.id, value: "Mauve", slug: "mauve", swatchHex: "#B87F8C", sortOrder: 4 },
      { attributeId: colorAttr.id, value: "Lavender", slug: "lavender", swatchHex: "#C9A9DD", sortOrder: 5 },
    ])
    .returning();
  const color = Object.fromEntries(colorValues.map((v) => [v.slug, v]));

  const sizeValues = await db
    .insert(attributeValues)
    .values([
      { attributeId: sizeAttr.id, value: "S", slug: "s", sortOrder: 1 },
      { attributeId: sizeAttr.id, value: "M", slug: "m", sortOrder: 2 },
      { attributeId: sizeAttr.id, value: "L", slug: "l", sortOrder: 3 },
      { attributeId: sizeAttr.id, value: "XL", slug: "xl", sortOrder: 4 },
    ])
    .returning();
  const size = Object.fromEntries(sizeValues.map((v) => [v.slug, v]));

  const ageValues = await db
    .insert(attributeValues)
    .values([
      { attributeId: ageAttr.id, value: "0-6 Months", slug: "0-6-months", sortOrder: 1 },
      { attributeId: ageAttr.id, value: "6-12 Months", slug: "6-12-months", sortOrder: 2 },
      { attributeId: ageAttr.id, value: "1-2 Years", slug: "1-2-years", sortOrder: 3 },
      { attributeId: ageAttr.id, value: "2-4 Years", slug: "2-4-years", sortOrder: 4 },
      { attributeId: ageAttr.id, value: "4-6 Years", slug: "4-6-years", sortOrder: 5 },
    ])
    .returning();
  const age = Object.fromEntries(ageValues.map((v) => [v.slug, v]));

  // ---- Products ------------------------------------------------------------
  type SeedProduct = {
    categoryId: number;
    name: string;
    slug: string;
    sku: string;
    shortDescription: string;
    description: string;
    regularPrice: string;
    salePrice?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    stockQuantity: number;
    specifications?: Record<string, string>;
    sizeChart?: Record<string, string>;
    variantAttributes?: { attribute: typeof colorAttr; values: (typeof colorValues)[number][] }[];
  };

  const seedProducts: SeedProduct[] = [
    {
      categoryId: chiffonHijabCat.id,
      name: "Premium Chiffon Hijab",
      slug: "premium-chiffon-hijab",
      sku: "FC-HIJ-CHIF-001",
      shortDescription: "Lightweight, breathable chiffon hijab with a soft matte finish.",
      description: "Our best-selling chiffon hijab, made from premium lightweight fabric that drapes beautifully and stays comfortable all day. Easy to style, non-slip, and available in five signature FeboColour shades.",
      regularPrice: "450.00",
      isBestSeller: true,
      stockQuantity: 120,
      specifications: {
        Fabric: "Premium chiffon",
        Length: "70 inches",
        Width: "27 inches",
        Care: "Hand wash cold, do not bleach",
        Origin: "Made in Bangladesh",
      },
      variantAttributes: [{ attribute: colorAttr, values: [color["baby-pink"], color["black"], color["white"], color["mauve"], color["lavender"]] }],
    },
    {
      categoryId: jerseyHijabCat.id,
      name: "Jersey Hijab",
      slug: "jersey-hijab",
      sku: "FC-HIJ-JERS-001",
      shortDescription: "Stretchy jersey hijab, perfect for everyday wear.",
      description: "A comfortable jersey hijab with gentle stretch for an easy no-pin wrap. Soft against the skin and holds its shape through the day.",
      regularPrice: "380.00",
      stockQuantity: 90,
      variantAttributes: [{ attribute: colorAttr, values: [color["baby-pink"], color["black"], color["lavender"]] }],
    },
    {
      categoryId: instantHijabCat.id,
      name: "Instant Hijab 2-Piece",
      slug: "instant-hijab-2pc",
      sku: "FC-HIJ-INST-001",
      shortDescription: "No-wrap instant hijab set for quick, easy styling.",
      description: "Two-piece instant hijab — slip it on in seconds with no pins required. Includes an inner cap layer for full coverage and comfort.",
      regularPrice: "420.00",
      stockQuantity: 75,
      variantAttributes: [{ attribute: colorAttr, values: [color["black"], color["white"], color["mauve"]] }],
    },
    {
      categoryId: classicAbayaCat.id,
      name: "Classic Abaya",
      slug: "classic-abaya",
      sku: "FC-ABY-CLSC-001",
      shortDescription: "Timeless, flowing silhouette in premium nida fabric.",
      description: "A wardrobe essential — our Classic Abaya is cut from flowing, opaque nida fabric for elegant everyday modest wear. Full-length with a relaxed fit.",
      regularPrice: "1650.00",
      isBestSeller: true,
      stockQuantity: 40,
      specifications: {
        Fabric: "Premium nida",
        Closure: "Front zip",
        Care: "Dry clean recommended",
        Origin: "Made in Bangladesh",
      },
      sizeChart: {
        S: "Bust 34-36 in · Length 54 in",
        M: "Bust 37-39 in · Length 55 in",
        L: "Bust 40-42 in · Length 56 in",
        XL: "Bust 43-45 in · Length 57 in",
      },
      variantAttributes: [
        { attribute: colorAttr, values: [color["black"]] },
        { attribute: sizeAttr, values: [size["s"], size["m"], size["l"], size["xl"]] },
      ],
    },
    {
      categoryId: embroideredAbayaCat.id,
      name: "Embroidered Abaya",
      slug: "embroidered-abaya",
      sku: "FC-ABY-EMBR-001",
      shortDescription: "Statement abaya with delicate hand-finished embroidery.",
      description: "Elevate your modest wardrobe with hand-finished embroidery detailing along the sleeves and hem. A premium occasion-ready piece.",
      regularPrice: "1950.00",
      stockQuantity: 25,
      variantAttributes: [
        { attribute: colorAttr, values: [color["black"], color["lavender"]] },
        { attribute: sizeAttr, values: [size["m"], size["l"]] },
      ],
    },
    {
      categoryId: babyInstantHijabCat.id,
      name: "Baby Girl Instant Hijab Set",
      slug: "baby-instant-hijab-set",
      sku: "FC-BABY-INST-001",
      shortDescription: "Ultra-soft instant hijab set sized for baby girls.",
      description: "Specially designed for delicate skin — our Baby Girl Instant Hijab Set uses breathable, hypoallergenic fabric with no pins or ties. Easy on, easy off.",
      regularPrice: "350.00",
      salePrice: "299.00",
      isBestSeller: true,
      stockQuantity: 60,
      variantAttributes: [
        { attribute: colorAttr, values: [color["baby-pink"], color["white"]] },
        { attribute: ageAttr, values: [age["0-6-months"], age["6-12-months"], age["1-2-years"]] },
      ],
    },
    {
      categoryId: babyHijabSetsCat.id,
      name: "Baby Frill Hijab",
      slug: "baby-frill-hijab",
      sku: "FC-BABY-FRIL-001",
      shortDescription: "Adorable frill-trimmed hijab for toddlers.",
      description: "A sweet frill trim makes this the perfect hijab for special occasions and everyday wear alike. Soft cotton-blend fabric, gentle on toddler skin.",
      regularPrice: "320.00",
      stockQuantity: 50,
      variantAttributes: [
        { attribute: colorAttr, values: [color["baby-pink"], color["lavender"]] },
        { attribute: ageAttr, values: [age["1-2-years"], age["2-4-years"]] },
      ],
    },
    {
      categoryId: babyHijabSetsCat.id,
      name: "Baby Girl Hijab Gift Set",
      slug: "baby-girl-hijab-gift-set",
      sku: "FC-BABY-GIFT-001",
      shortDescription: "A beautifully packaged 3-hijab gift set for baby girls.",
      description: "The perfect gift — three coordinating baby hijabs in a keepsake box. Soft, breathable fabric sized for growing babies.",
      regularPrice: "850.00",
      isFeatured: true,
      stockQuantity: 35,
      variantAttributes: [{ attribute: ageAttr, values: [age["0-6-months"], age["6-12-months"], age["1-2-years"], age["2-4-years"]] }],
    },
    {
      categoryId: babyHijabSetsCat.id,
      name: "Kids Hijab & Cap Combo",
      slug: "kids-hijab-cap-combo",
      sku: "FC-BABY-COMB-001",
      shortDescription: "Matching hijab and inner cap combo for young girls.",
      description: "A coordinated hijab and inner cap set that stays secure through play and school. Machine washable and quick-drying.",
      regularPrice: "390.00",
      isFeatured: true,
      stockQuantity: 45,
      variantAttributes: [{ attribute: ageAttr, values: [age["2-4-years"], age["4-6-years"]] }],
    },
    {
      categoryId: chiffonHijabCat.id,
      name: "Satin Hijab — Pearl",
      slug: "satin-hijab-pearl",
      sku: "FC-HIJ-SATN-001",
      shortDescription: "Silky satin finish with a subtle pearl sheen.",
      description: "A luminous satin hijab with a soft pearl sheen, perfect for evenings and special occasions.",
      regularPrice: "480.00",
      isFeatured: true,
      stockQuantity: 30,
      variantAttributes: [{ attribute: colorAttr, values: [color["white"], color["baby-pink"], color["lavender"]] }],
    },
    {
      categoryId: instantHijabCat.id,
      name: "Cotton Hijab Set (3-Pack)",
      slug: "cotton-hijab-set-3pack",
      sku: "FC-HIJ-COTN-001",
      shortDescription: "Everyday cotton hijabs, sold as a set of three.",
      description: "Breathable 100% cotton hijabs for daily wear — this set of three gives you a full week's rotation of easy-care essentials.",
      regularPrice: "990.00",
      stockQuantity: 55,
    },
    {
      categoryId: accessories.id,
      name: "Hijab Magnet Pins (Set of 4)",
      slug: "hijab-magnet-pins",
      sku: "FC-ACC-PINS-001",
      shortDescription: "No-snag magnetic pins for secure, damage-free styling.",
      description: "Strong magnetic hijab pins that hold fabric securely without piercing or snagging delicate materials. Set of four in brushed gold finish.",
      regularPrice: "120.00",
      stockQuantity: 200,
    },
  ];

  const insertedProductsBySlug = new Map<string, { id: number }>();

  for (const seedProduct of seedProducts) {
    const { variantAttributes, ...productData } = seedProduct;
    const [product] = await db.insert(products).values(productData).returning();
    insertedProductsBySlug.set(product.slug, product);

    if (!variantAttributes || variantAttributes.length === 0) continue;

    await db.insert(productAttributes).values(
      variantAttributes.map((va, i) => ({
        productId: product.id,
        attributeId: va.attribute.id,
        sortOrder: i,
      })),
    );

    const combinations = cartesian(variantAttributes.map((va) => va.values));
    const variantRows = combinations.map((combo) => {
      const skuSuffix = combo.map((v) => v.slug).join("-").toUpperCase();
      return {
        productId: product.id,
        sku: `${product.sku}-${skuSuffix}`,
        stockQuantity: Math.floor(Math.random() * 20) + 5,
      };
    });
    const insertedVariants = await db.insert(productVariants).values(variantRows).returning();

    const variantValueRows = insertedVariants.flatMap((variant, idx) =>
      combinations[idx].map((value) => ({
        variantId: variant.id,
        attributeValueId: value.id,
      })),
    );
    await db.insert(productVariantValues).values(variantValueRows);
  }

  // ---- Homepage banner -----------------------------------------------------
  await db.insert(homepageBanners).values([
    {
      title: "Elegant Hijabs & Abayas, for Every Age",
      subtitle: "Premium, comfortable and beautifully soft — including a dedicated collection for baby girls. Order easily, we deliver across Bangladesh.",
      // No real photo yet — upload one via /admin/banners. HeroBanner falls back to a placeholder.
      image: "",
      ctaLabel: "Shop Now",
      ctaUrl: "/category/hijab",
      secondaryCtaLabel: "Baby Girl Collection",
      secondaryCtaUrl: "/category/baby-girl-hijab",
      sortOrder: 1,
    },
  ]);

  // ---- Shipping methods ------------------------------------------------------
  await db.insert(shippingMethodConfigs).values([
    {
      code: "inside_city",
      name: "Inside City",
      description: "Delivery within the city, 1–3 business days.",
      rateType: "flat",
      flatRate: "70.00",
      sortOrder: 1,
    },
    {
      code: "outside_city",
      name: "Outside City",
      description: "Nationwide delivery, 3–5 business days.",
      rateType: "flat",
      flatRate: "130.00",
      sortOrder: 2,
    },
    {
      code: "pickup",
      name: "Store Pickup",
      description: "Collect your order in person — we'll confirm a pickup time with you.",
      rateType: "free",
      flatRate: "0.00",
      sortOrder: 3,
    },
  ]);

  // ---- Payment methods ---------------------------------------------------
  // Only COD is active in Phase 2 — bKash/Nagad/Rocket/Bank Transfer manual
  // entry forms ship in Phase 5; the config rows exist now so activating
  // them later is just a data + UI change, not a schema change.
  await db.insert(paymentMethodConfigs).values([
    {
      code: "cod",
      name: "Cash on Delivery",
      instructions: "Pay in cash when your order is delivered.",
      isActive: true,
      requiresManualVerification: false,
      sortOrder: 1,
    },
    {
      code: "bkash",
      name: "bKash",
      instructions: "Send payment to our bKash merchant number and share the transaction ID.",
      isActive: false,
      requiresManualVerification: true,
      sortOrder: 2,
    },
    {
      code: "nagad",
      name: "Nagad",
      instructions: "Send payment to our Nagad merchant number and share the transaction ID.",
      isActive: false,
      requiresManualVerification: true,
      sortOrder: 3,
    },
    {
      code: "rocket",
      name: "Rocket",
      instructions: "Send payment to our Rocket merchant number and share the transaction ID.",
      isActive: false,
      requiresManualVerification: true,
      sortOrder: 4,
    },
    {
      code: "bank_transfer",
      name: "Bank Transfer",
      instructions: "Transfer to our bank account and share the transaction reference.",
      isActive: false,
      requiresManualVerification: true,
      sortOrder: 5,
    },
  ]);

  // ---- Admin user ------------------------------------------------------------
  const adminEmail = "admin@febocolour.com";
  const adminPassword = "FeboAdmin123!";
  await db.insert(adminUsers).values({
    email: adminEmail,
    passwordHash: await hashPassword(adminPassword),
    fullName: "Store Admin",
    role: "super_admin",
  });

  // ---- Sample reviews (for admin moderation demo) --------------------------
  const chiffonHijab = insertedProductsBySlug.get("premium-chiffon-hijab");
  const classicAbaya = insertedProductsBySlug.get("classic-abaya");
  if (chiffonHijab && classicAbaya) {
    await db.insert(reviews).values([
      {
        productId: chiffonHijab.id,
        guestName: "Sumaiya R.",
        rating: 5,
        title: "So soft and comfortable",
        body: "The fabric quality is amazing and it doesn't slip. Highly recommend!",
        isApproved: true,
      },
      {
        productId: classicAbaya.id,
        guestName: "Nusrat J.",
        rating: 5,
        title: "Perfect fit",
        body: "Exactly like the pictures, fast delivery too.",
        isApproved: true,
      },
      {
        productId: chiffonHijab.id,
        guestName: "Farzana A.",
        rating: 4,
        title: "Pending review",
        body: "Nice color, waiting to see how it holds up after a few washes.",
        isApproved: false,
      },
    ]);
  }

  console.log(`Seeded ${seedProducts.length} products across categories.`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
