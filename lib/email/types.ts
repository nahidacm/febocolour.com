export type OrderEmailPayload = {
  orderNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  addressLine: string;
  city: string;
  area?: string;
  shippingMethodName: string;
  paymentMethodName: string;
  items: { name: string; variantLabel: string | null; quantity: number; lineTotal: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
};
