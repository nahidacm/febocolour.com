import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";

export async function GET() {
  const result = await db.execute(sql`select now() as time, current_database() as database`);
  const row = result.rows[0];

  return Response.json({ status: "ok", db: row });
}
