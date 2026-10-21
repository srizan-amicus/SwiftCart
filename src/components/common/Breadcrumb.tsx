import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: "default" | "light";
}

export default function Breadcrumb({
  items,
  className = "",
  variant = "default",
}: BreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  const isLight = variant === "light";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm ${
        isLight ? "text-white" : "text-gray-600"
      } ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={isLight ? "text-white/70" : "text-gray-400"}
                >
                  /
                </span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`transition-colors ${
                    isLight
                      ? "font-semibold hover:underline"
                      : "hover:text-orange-600"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={
                    isLast
                      ? isLight
                        ? "font-medium text-white"
                        : "font-medium text-gray-900"
                      : ""
                  }
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
