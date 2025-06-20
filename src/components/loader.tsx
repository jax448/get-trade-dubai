"use client";

import React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Ensure you have a utils file with this helper

// Define the loader variants using CVA for scalable design system
const loaderVariants = cva("animate-spin rounded-full border-t-transparent", {
  variants: {
    size: {
      xs: "h-[1.2rem] w-[1.2rem] border-2",
      sm: "h-[1.6rem] w-[1.6rem] border-2",
      md: "h-[2rem] w-[2rem] border-2 ",
      lg: "h-[2.4rem] w-[2.4rem] border-[3px] ",
      xl: "h-[3.2rem] w-[3.2rem] border-4",
    },
    variant: {
      secondary: "border-secondary/30 border-t-secondary",
      success: "border-green-500/30 border-t-green-500",
      danger: "border-red-500/30 border-t-red-500",
      warning: "border-yellow-500/30 border-t-yellow-500",
      info: "border-blue-500/30 border-t-blue-500",
      light: "border-gray-200/30 border-t-gray-200",
      dark: "border-gray-800/30 border-t-gray-800 ",
      white: "border-white/30 border-t-white",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "light",
  },
});

// Combine CVA properties with custom props
interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  className?: string;
}

// The base Loader component
export const CustomLoader = ({
  className,
  size,
  variant,
  ...props
}: LoaderProps) => {
  return (
    <div
      className={cn(loaderVariants({ size, variant }), className)}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
};
