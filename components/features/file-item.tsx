import {
  FaDownload,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdOutlineBrokenImage } from "react-icons/md";
import { formatBytes, ProcessedFileState } from "@/lib/utils";
import { Progress } from "../ui/progress";

interface FileItemProps {
  fileState: ProcessedFileState;
}

export function FileItem({ fileState }: FileItemProps) {
  const {
    originalFile,
    status,
    progress,
    originalSize,
    compressedSize,
    thumbnailUrl,
    downloadUrl,
    error,
    keptOriginal,
  } = fileState;

  const isFinished = status === "terminado";
  const isProcessing = status === "procesando" || status === "fila";
  const hasError = status === "error";

  // Calcular porcentaje de ahorro o mostrar mensaje de original mantenido
  let savingsDoc = null;
  if (isFinished && compressedSize) {
    if (keptOriginal) {
      savingsDoc = (
        <span className="text-xs text-amber-600 font-medium ml-2">
          (Mantenido original - no se pudo comprimir)
        </span>
      );
    } else {
      const savingsPercent = Math.round(
        ((originalSize - compressedSize) / originalSize) * 100
      );
      savingsDoc = (
        <span className="text-xs text-success-green font-medium ml-2">
          (Ahorro del {savingsPercent}%)
        </span>
      );
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-4 border border-silver-gray">
      {/* Miniatura */}
      <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-cloud-gray flex items-center justify-center border border-silver-gray">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={originalFile.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <MdOutlineBrokenImage className="text-carbon-gray h-6 w-6" />
        )}

        {hasError && (
          <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
            <FaExclamationCircle className="text-red-500 h-5 w-5" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="truncate text-sm font-medium text-jet-black">
            {originalFile.name}
          </p>

          {isFinished && (
            <span className="text-sm font-medium text-primary/80">{progress}%</span>
          )}
          {hasError && (
            <span className="text-sm font-medium text-red-500">Error</span>
          )}
        </div>

        {/* Estado: Procesando */}
        {isProcessing && !hasError && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-carbon-gray">
              <span>{formatBytes(originalSize)} → WebP</span>
              {status === "procesando" && <span>{progress}%</span>}
            </div>
            <Progress value={progress} />
            {status === "fila" && (
              <span className="text-xs text-carbon-gray flex items-center mt-1">
                <FaSpinner className="animate-spin mr-1" /> En la fila...
              </span>
            )}
          </div>
        )}

        {/* Estado: Finalizado */}
        {isFinished && compressedSize && (
          <div className="flex items-center text-xs text-carbon-gray">
            <span>{formatBytes(originalSize)}</span>
            <span className="mx-1">→</span>
            <span className="font-semibold text-jet-black">
              {formatBytes(compressedSize)} {keptOriginal ? "(Original)" : "(WebP)"}
            </span>
            {savingsDoc}
          </div>
        )}

        {/* Estado: Error */}
        {hasError && (
          <p className="text-xs text-red-500 truncate">
            {error || "Error al procesar"}
          </p>
        )}
      </div>

      {isFinished && downloadUrl && (
        <a
          href={downloadUrl}
          download={keptOriginal ? originalFile.name : `${originalFile.name.split(".")[0]}.webp`}
          className="shrink-0 ml-2 text-primary hover:text-primary-hover transition-colors font-medium text-sm flex items-center gap-1"
        >
          <FaDownload />
          Descargar
        </a>
      )}
    </div>
  );
}
