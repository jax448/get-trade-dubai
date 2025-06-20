"use client";
// import { copyToClipboard } from "@/";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { ButtonHTMLAttributes } from "react";
import CustomToast from "./CustomToast";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  className?: string;
  children?: ReactNode;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className,
  children,
  ...props
}) => {
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await copyToClipboard(text);
      toast.custom(
        (t) => (
          <CustomToast
            title="Copied to clipboard!"
            type="success"
            key={t.id}
            onClose={() => toast.dismiss(t.id)}
            t={t}
          />
        ),
        {
          duration: 800,
        }
      );
    } catch {
      toast.custom(
        (t) => (
          <CustomToast
            title="Failed to copy text."
            type="error"
            key={t.id}
            onClose={() => toast.dismiss(t.id)}
            t={t}
          />
        ),
        {
          duration: 800,
        }
      );
    }
  };

  return (
    <Button
      onClick={handleCopy}
      className={cn(className, " px-[1rem] py-[0.8rem] h-fit ")}
      {...props}
    >
      {children}
    </Button>
  );
};
