"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer mr-2 h-5 w-5 shrink-0 rounded-sm border-2 border-gray-300 bg-white",
        "hover:border-blue-500 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200",
        "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600",
        "dark:bg-gray-800 dark:border-gray-600 dark:hover:border-blue-400",
        "dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500",
        "transition-all duration-200 ease-in-out",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "aria-invalid:border-red-500 aria-invalid:ring-red-200 dark:aria-invalid:border-red-400",
        className
      )}
      {...props}>
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex h-full w-full items-center justify-center text-white transition-opacity duration-150">
        <CheckIcon className="h-4 w-4 stroke-[3px]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox }