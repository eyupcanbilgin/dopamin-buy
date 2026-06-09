import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "narrow" | "wide";
};

const sizeClassName = {
  default: "max-w-[1200px]",
  narrow: "max-w-3xl",
  wide: "max-w-[1320px]",
};

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeClassName[size], className)}
      {...props}
    />
  );
}
