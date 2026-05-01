"use client";

import { useState, useCallback } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FaSpinner, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

import { Dropzone } from "@/components/features/dropzone";
import { FileItem } from "@/components/features/file-item";
import { Button } from "@/components/ui/button";
import { ProcessedFileState } from "@/lib/utils";
import { compressImageToWebP } from "@/lib/compression";

const generateId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function Home() {
  const [files, setFiles] = useState<ProcessedFileState[]>([]);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);

  const handleFilesAdded = useCallback(async (incomingFiles: File[]) => {
    const newFileStates: ProcessedFileState[] = incomingFiles.map((file) => ({
      id: generateId(),
      originalFile: file,
      processedBlob: null,
      status: "fila",
      progress: 0,
      originalSize: file.size,
      // URL temporal para la miniatura inicial
      thumbnailUrl: URL.createObjectURL(file),
    }));

    // Agregar a la lista existente
    setFiles((prev) => [...prev, ...newFileStates]);

    // procesamiento para cada archivo nuevo
    newFileStates.forEach(async (fileState) => {
      await processFile(fileState.id, fileState.originalFile);
    });
  }, []);

  // procesamiento individual
  const processFile = async (id: string, file: File) => {
    updateFileState(id, { status: "procesando", progress: 0 });

    try {
      const compressionResult = await compressImageToWebP(file, {
        onProgress: (progress) => {
          // Actualizar progreso en tiempo real
          updateFileState(id, { progress: Math.round(progress) });
        },
      });

      // Procesamiento exitoso
      updateFileState(id, {
        status: "terminado",
        progress: 100,
        processedBlob: compressionResult.blob,
        compressedSize: compressionResult.blob.size,
        keptOriginal: compressionResult.keptOriginal,
        // URL de descarga para el blob resultante
        downloadUrl: URL.createObjectURL(compressionResult.blob),
      });
    } catch (error) {
      console.error(`Error procesando archivo ${id}:`, error);
      updateFileState(id, {
        status: "error",
        progress: 0,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  // Helper para actualizar el estado de un archivo específico inmutablemente
  const updateFileState = (
    id: string,
    updates: Partial<ProcessedFileState>
  ) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  // Limpiar la lista y revocar URLs para evitar memory leaks
  const handleClearList = () => {
    files.forEach((f) => {
      if (f.thumbnailUrl) URL.revokeObjectURL(f.thumbnailUrl);
      if (f.downloadUrl) URL.revokeObjectURL(f.downloadUrl);
    });
    setFiles([]);
  };

  // Descarga masiva
  const handleDownloadAll = async () => {
    const finishedFiles = files.filter(
      (f) => f.status === "terminado" && f.processedBlob
    );
    if (finishedFiles.length === 0) return;

    setIsGeneratingZip(true);
    try {
      const zip = new JSZip();

      // Agregar cada archivo al zip (WebP u original)
      finishedFiles.forEach((fileState) => {
        // Usar nombre original si se mantuvo el formato, sino cambiar a .webp
        const fileName = fileState.keptOriginal 
          ? fileState.originalFile.name
          : fileState.originalFile.name.replace(/\.[^/.]+$/, "") + ".webp";
        
        // Asegurar nombres únicos en el zip si hay duplicados
        let uniqueName = fileName;
        let counter = 1;
        const extension = fileState.keptOriginal 
          ? fileName.substring(fileName.lastIndexOf('.'))
          : ".webp";
        const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
        
        while (zip.file(uniqueName)) {
          uniqueName = baseName + ` (${counter})` + extension;
          counter++;
        }

        if (fileState.processedBlob) {
          zip.file(uniqueName, fileState.processedBlob);
        }
      });

      // Generar el archivo zip
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "imagenes-optimizadas.zip");
    } catch (error) {
      console.error("Error generando ZIP:", error);
      alert("Hubo un error al crear el archivo ZIP.");
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const finishedCount = files.filter((f) => f.status === "terminado").length;
  const isProcessingAny = files.some(
    (f) => f.status === "procesando" || f.status === "fila"
  );
  const hasFiles = files.length > 0;

  return (
    <main className="min-h-screen bg-white pb-6">
      <div className="container mx-auto px-4 pt-8 lg:pt-16 pb-20 text-center max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          OPTIMIZEIMG
        </h1>
        <p className="text-md text-carbon-gray max-w-2xl mx-auto">
          Comprime y convierte tus imágenes a WebP.
          <br />
          Rápido, privado y sin pérdida de calidad.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-3xl">
        <Dropzone onFilesAdded={handleFilesAdded} />

        {/* Lista de Archivos y estados */}
        {hasFiles && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6 text-jet-black font-medium">
              {isProcessingAny ? (
                <>
                  <FiRefreshCw className="animate-spin text-accent h-5 w-5" />
                  <h3>Procesando archivos...</h3>
                </>
              ) : finishedCount > 0 && finishedCount === files.length ? (
                <>
                  <FaCheckCircle className="text-success-green h-5 w-5" />
                  <h3>Proceso finalizado</h3>
                </>
              ) : (
                <h3>Tus archivos</h3>
              )}
              {finishedCount > 0 && !isProcessingAny && (
                <span className="ml-auto text-sm text-carbon-gray font-normal uppercase tracking-wider">
                  {finishedCount} ARCHIVOS LISTOS
                </span>
              )}
            </div>

            <div className="space-y-3">
              {files.map((fileState) => (
                <FileItem key={fileState.id} fileState={fileState} />
              ))}
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-silver-gray pt-6">
              <Button
                variant="outline"
                onClick={handleClearList}
                disabled={isProcessingAny || isGeneratingZip}
              >
                Limpiar lista
              </Button>
              <Button
                onClick={handleDownloadAll}
                disabled={
                  finishedCount === 0 || isProcessingAny || isGeneratingZip
                }
              >
                {isGeneratingZip ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Generando ZIP...
                  </>
                ) : (
                  `Descargar todo (.zip)`
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-28 px-4 lg:px-20 text-center text-sm text-carbon-gray">
        <div className="flex flex-wrap justify-between text-center">
          <div className="flex gap-2 lg:items-center">
            <FaShieldAlt className="text-lg" />
            <p>
              Las imágenes nunca salen de tu navegador. Procesamiento 100%
              local.
            </p>
          </div>
          <div className="p-4 lg:p-0 w-full lg:w-auto">
            <a
              href="https://github.com/Emcahell/OPTIMIZEIMG"
              target="_blank"
              className="hover:text-primary"
            >
              GITHUB
            </a>
          </div>
          <div className="w-full lg:w-auto">
            <a
              href="https://portfolio-emcahell.vercel.app"
              target="_blank"
              className="hover:text-primary"
            >
              @emcahell
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
