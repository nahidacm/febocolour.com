import "server-only";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

/**
 * Local-filesystem storage adapter behind a stable interface (saveFile/getFileUrl/deleteFile).
 * Swapping to S3-compatible object storage later means writing one new adapter behind this
 * same interface — callers and the DB (which only ever stores the relative key) don't change.
 */
export async function saveFile(file: File, folder: string): Promise<string> {
  const ext = path.extname(file.name) || "";
  const key = `${folder}/${randomBytes(16).toString("hex")}${ext}`;
  const destPath = path.join(UPLOADS_ROOT, key);
  await mkdir(path.dirname(destPath), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(destPath, buffer);
  return key;
}

export function getFileUrl(key: string): string {
  return `/uploads/${key}`;
}

export async function deleteFile(key: string): Promise<void> {
  try {
    await unlink(path.join(UPLOADS_ROOT, key));
  } catch {
    // Already gone — nothing to do.
  }
}
