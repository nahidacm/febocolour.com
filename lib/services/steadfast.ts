import "server-only";

// Steadfast Courier's API still lives under their legacy packzy.com domain even
// though the storefront moved to steadfast.com.bd — this is the correct, current
// base URL per their own integration packages, not a typo.
const BASE_URL = process.env.STEADFAST_BASE_URL ?? "https://portal.packzy.com/api/v1";
const API_KEY = process.env.STEADFAST_API_KEY;
const SECRET_KEY = process.env.STEADFAST_SECRET_KEY;

function isConfigured(): boolean {
  return !!API_KEY && !!SECRET_KEY;
}

function headers(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Api-Key": API_KEY!,
    "Secret-Key": SECRET_KEY!,
  };
}

export type SteadfastDeliveryStatus =
  | "pending"
  | "delivered_approval_pending"
  | "partial_delivered_approval_pending"
  | "cancelled_approval_pending"
  | "unknown_approval_pending"
  | "delivered"
  | "partial_delivered"
  | "cancelled"
  | "hold"
  | "in_review"
  | "unknown";

export type CreateSteadfastOrderInput = {
  invoice: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  codAmount: number;
  note?: string;
};

export type SteadfastResult<T> = { success: true; data: T } | { success: false; error: string };

/** Pushes an order to Steadfast for delivery. Returns their consignment id + tracking code/link. */
export async function createSteadfastOrder(
  input: CreateSteadfastOrderInput,
): Promise<SteadfastResult<{ consignmentId: string; trackingCode: string; trackingLink: string | null; status: string }>> {
  if (!isConfigured()) {
    return { success: false, error: "Steadfast API credentials are not configured." };
  }

  try {
    const res = await fetch(`${BASE_URL}/create_order`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        invoice: input.invoice,
        recipient_name: input.recipientName,
        recipient_phone: input.recipientPhone,
        recipient_address: input.recipientAddress,
        cod_amount: input.codAmount,
        note: input.note,
      }),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.consignment) {
      return { success: false, error: body?.message ?? `Steadfast API error (HTTP ${res.status}).` };
    }

    const consignment = body.consignment;
    return {
      success: true,
      data: {
        consignmentId: String(consignment.consignment_id),
        trackingCode: String(consignment.tracking_code),
        trackingLink: consignment.tracking_link ? String(consignment.tracking_link) : null,
        status: String(consignment.status ?? "in_review"),
      },
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Steadfast API request failed." };
  }
}

/** Pulls the current delivery status for a previously-created consignment. */
export async function getSteadfastStatus(
  consignmentId: string,
): Promise<SteadfastResult<{ status: SteadfastDeliveryStatus }>> {
  if (!isConfigured()) {
    return { success: false, error: "Steadfast API credentials are not configured." };
  }

  try {
    const res = await fetch(`${BASE_URL}/status_by_cid/${encodeURIComponent(consignmentId)}`, {
      method: "GET",
      headers: headers(),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.delivery_status) {
      return { success: false, error: body?.message ?? `Steadfast API error (HTTP ${res.status}).` };
    }

    return { success: true, data: { status: body.delivery_status as SteadfastDeliveryStatus } };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Steadfast API request failed." };
  }
}

export function isSteadfastConfigured(): boolean {
  return isConfigured();
}
