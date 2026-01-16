import imageCompression from "browser-image-compression";

interface CompressionOptions {
  onProgress: (progress: number) => void;
}

export async function compressImageToWebP(
  file: File,
  { onProgress }: CompressionOptions
): Promise<Blob> {
  const options = {
    // salida a WebP
    fileType: "image/webp",
    // Parámetro para el rendimiento con múltiples archivos
    useWebWorker: true,
    // Reducir un poco la calidad inicial para asegurar buena compresión
    initialQuality: 0.8,
    // Callback para la barra de progreso
    onProgress: onProgress,
    // limitar el tamaño máximo si es necesario
    maxWidthOrHeight: 3840,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    return compressedBlob;
  } catch (error) {
    console.error("Error durante la compresión:", error);
    throw error;
  }
}
