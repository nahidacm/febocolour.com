import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";

// A health check is only meaningful when it reflects live status — never cache it.
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await db.execute(sql`select now() as time, current_database() as database`);
  const row = result.rows[0];

  return Response.json({ status: "ok", db: row }, { headers: { "Cache-Control": "no-store" } });
}
