import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
