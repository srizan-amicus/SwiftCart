import type { ReactNode } from "react";

interface CardProps {
  variant?: "elevated" | "bordered" | "flat";
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const baseStyles = "flex h-full w-full flex-col rounded-lg p-4";

const variantStyles = {
  elevated: "bg-white shadow-lg",
  bordered: "border-2 border-gray-300 bg-white",
  flat: "bg-gray-200",
};

export default function Card({
  variant = "elevated",
  title,
  children,
  footer,
  className = "",
}: CardProps) {
  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>

      <div className="mb-6 flex-1 text-gray-600">{children}</div>

      {footer && <div className="mt-auto">{footer}</div>}
    </div>
  );
}
