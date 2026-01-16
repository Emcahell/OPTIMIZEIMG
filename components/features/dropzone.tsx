"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
}

export function Dropzone({ onFilesAdded }: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAdded(acceptedFiles);
      }
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/heic": [],
      "image/svg+xml": [],
    },
    noClick: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-colors bg-cloud-gray min-h-75",
        isDragActive ? "border-primary bg-primary/5" : "border-carbon-gray"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
        <FaCloudUploadAlt className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-jet-black mb-2">
        Arrastra y suelta tus imágenes aquí
      </h3>
      <p className="text-carbon-gray mb-8 max-w-md">
        Soporta JPG, PNG, WebP y HEIC. Máximo 10MB por archivo.
      </p>
      <Button onClick={open} className="font-semibold pl-4 pr-6 cursor-pointer bg-primary text-white hover:bg-primary-hover">
        <IoMdAddCircle className="mr-2 h-5 w-5" />
        Seleccionar Archivos
      </Button>
    </div>
  );
}
