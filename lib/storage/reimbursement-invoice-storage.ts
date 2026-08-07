import "server-only";

import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";

const extensionByMimeType = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
} as const;

export type ReimbursementInvoiceMimeType = keyof typeof extensionByMimeType;

const privateStorageRoot = resolve(process.cwd(), "storage", "private");
const reimbursementInvoiceRoot = resolve(
  privateStorageRoot,
  "reimbursement-invoices",
);
const storageKeyPattern =
  /^reimbursement-invoices\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(pdf|png|jpg)$/;

function getStoredInvoicePath(storageKey: string) {
  if (!storageKeyPattern.test(storageKey)) {
    throw new Error("Invalid reimbursement invoice storage key.");
  }

  const targetPath = resolve(privateStorageRoot, ...storageKey.split("/"));

  if (dirname(targetPath) !== reimbursementInvoiceRoot) {
    throw new Error("Invalid reimbursement invoice storage path.");
  }

  return targetPath;
}

export async function saveReimbursementInvoice(
  file: File,
  mimeType: ReimbursementInvoiceMimeType,
) {
  const extension = extensionByMimeType[mimeType];
  const storedFileName = `${randomUUID()}.${extension}`;
  const storageKey = `reimbursement-invoices/${storedFileName}`;
  const targetPath = getStoredInvoicePath(storageKey);

  await mkdir(reimbursementInvoiceRoot, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(targetPath, buffer, { flag: "wx" });

  const normalizedOriginalName = basename(file.name.replaceAll("\\", "/")).slice(
    0,
    255,
  );

  return {
    storageKey,
    originalName: normalizedOriginalName || `invoice.${extension}`,
    mimeType,
    size: file.size,
  };
}

export async function deleteReimbursementInvoice(storageKey: string) {
  const targetPath = getStoredInvoicePath(storageKey);

  try {
    await unlink(targetPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
