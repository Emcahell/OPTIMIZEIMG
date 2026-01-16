import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  isFinished?: boolean;
}

export function Progress({
  value,
  className,
  isFinished = false,
}: ProgressProps) {
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-silver-gray/50",
        className
      )}
    >
      <div
        className={cn(
          "h-full w-full flex-1 transition-all duration-200 ease-in-out",
          isFinished ? "bg-success-green" : "bg-primary"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
}
