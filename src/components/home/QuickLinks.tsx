import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/constants/button-variants";

const quickLinks = [
  {
    title: "Order Now",
    description: "Already know your product number?",
    action: "ORDER NOW",
    variant: "elevated" as const,
    href: "/products",
  },
  {
    title: "Aftermarket Products",
    description: "Browse through our products catalog.",
    action: "AFTERMARKET PRODUCTS",
    variant: "flat" as const,
    href: "/products",
  },
  {
    title: "Interactive Parts Manuals",
    description: "Find the right products in our interactive manuals.",
    action: "VIEW MANUALS",
    variant: "elevated" as const,
    href: "/products",
  },
  {
    title: "Technical Publications",
    description:
      "Download schematics, forms and manuals (Parts, Operation, Service and Supplemental).",
    action: "SEARCH PUBLICATIONS",
    variant: "flat" as const,
    href: "/products",
  },
];

export default function QuickLinks() {
  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {quickLinks.map((link) => (
            <div key={link.title} className="h-full">
              <Card
                variant={link.variant}
                title={link.title}
                className="rounded-xl"
                footer={
                  <Button
                    variant={ButtonVariant.Primary}
                    href={link.href}
                    className="h-11 rounded-md text-[10px] font-bold tracking-wide sm:text-[11px]"
                  >
                    {link.action}
                  </Button>
                }
              >
                {link.description}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
