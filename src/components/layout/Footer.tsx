import Link from "next/link";
import {
  BookOpen,
  CreditCard,
  Headset,
  Newspaper,
  ShieldCheck,
  Truck,
} from "lucide-react";

const serviceFeatures = [
  {
    title: "SECURE PAYMENTS",
    description: "Safe and secure payment options",
    Icon: CreditCard,
  },
  {
    title: "HELP CENTER",
    description: "We're here to help",
    Icon: Headset,
  },
  {
    title: "RELIABLE SHIPPING",
    description: "Fast and reliable delivery",
    Icon: Truck,
  },
];

const quickLinks = [
  { label: "Products", href: "/products" },
  { label: "Sign In", href: "/login" },
  { label: "Create Account", href: "/register" },
];

export default function Footer() {
  return (
    <footer className="mt-auto">
      <section className="bg-gray-800 text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-3">
          {serviceFeatures.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="flex items-center justify-center gap-4 sm:justify-start"
            >
              <Icon size={30} strokeWidth={1.7} aria-hidden="true" />

              <div>
                <h2 className="text-xs font-bold tracking-wide">{title}</h2>
                <p className="mt-1 text-sm text-gray-300">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h2 className="mb-4 text-sm font-bold text-gray-900">
              Quick Links
            </h2>

            <ul className="space-y-3 text-sm text-gray-600">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-orange-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
              <Newspaper size={18} aria-hidden="true" />
              Press Releases
            </h2>
            <p className="text-sm leading-6 text-gray-600">
              Find updates and announcements about SwiftCart.
            </p>
          </div>

          <div>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
              <BookOpen size={18} aria-hidden="true" />
              Resources
            </h2>
            <p className="text-sm leading-6 text-gray-600">
              Explore product information and shopping resources.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-bold text-gray-900">
              Shop Online
            </h2>

            <p className="text-sm leading-6 text-gray-600">
              Discover products, explore categories, and shop your favorites
              with SwiftCart.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-5 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={20}
              className="text-orange-500"
              aria-hidden="true"
            />
            <span>Secure shopping experience</span>
          </div>

          <p>© {new Date().getFullYear()} SwiftCart</p>
        </div>
      </section>
    </footer>
  );
}
