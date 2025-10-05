"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  const thumbClass = "block h-6 w-6 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:scale-110 hover:bg-blue-50 hover:border-blue-500";

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...rest}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      
      {/* Render a Thumb component for each value in the array */}
      {props.value && Array.isArray(props.value) ? (
        props.value.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={thumbClass}
          />
        ))
      ) : (
        <SliderPrimitive.Thumb className={thumbClass} />
      )}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = "Slider";

export { Slider };
