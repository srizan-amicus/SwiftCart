"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";

interface CartSubmitButtonProps {
  children: React.ReactNode;
  pendingText: string;
  disabled?: boolean;
  className?: string;
}

export default function CartSubmitButton({
  children,
  pendingText,
  disabled = false,
  className,
}: CartSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending} className={className}>
      {pending ? pendingText : children}
    </Button>
  );
}
