import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// combinar clases de Tailwind condicionalmente
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear bytes a KB/MB
export function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export type FileStatus = "fila" | "procesando" | "terminado" | "error";

export interface ProcessedFileState {
  id: string;
  originalFile: File;
  processedBlob: Blob | null;
  status: FileStatus;
  progress: number;
  originalSize: number;
  compressedSize?: number;
  thumbnailUrl: string;
  downloadUrl?: string;
  error?: string;
}
