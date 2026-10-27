"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut, Menu, ShoppingCart, UserRound, X } from "lucide-react";

import SearchBar from "@/components/common/SearchBar";
import { logoutAction } from "@/app/(auth)/actions";

interface NavbarProps {
  cartItemCount?: number;
  isLoggedIn: boolean;
  userName: string | null;
}

export default function Navbar({
  cartItemCount = 0,
  isLoggedIn,
  userName,
}: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  function handleSearch() {
    const query = searchTerm.trim();
    const params = new URLSearchParams();

    if (query) {
      params.set("search", query);
    }

    const queryString = params.toString();

    router.push(queryString ? `/products?${queryString}` : "/products");
    setMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function getLinkClass(href: string) {
    return `transition hover:text-orange-600 ${
      isActive(href) ? "font-bold text-orange-600" : "font-medium text-gray-600"
    }`;
  }

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    ...(isLoggedIn
      ? [
          { label: "Orders", href: "/orders" },
          { label: "Checkout", href: "/checkout" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1280px] px-3 sm:px-4">
        <div className="flex h-16 items-center gap-3 lg:gap-5">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-orange-500 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* SwiftCart logo */}
          <Link
            href="/"
            aria-label="SwiftCart home"
            className="flex shrink-0 items-center border-r border-gray-200 pr-3 sm:pr-5"
          >
            <span className="text-2xl font-black italic tracking-tight text-orange-600">
              Swift
            </span>
            <span className="ml-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cart
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden min-w-0 flex-1 lg:block">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              placeholder="Search by product name or keyword"
              className="w-full"
            />
          </div>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="ml-auto flex shrink-0 items-center gap-3 text-xs font-medium sm:gap-4"
          >
            <div className="hidden items-center gap-5 lg:flex">
              {navigationLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getLinkClass(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Cart */}
            {isLoggedIn && (
              <Link
                href="/cart"
                aria-label={`Cart, ${cartItemCount} items`}
                className={`relative shrink-0 transition hover:text-orange-600 ${
                  isActive("/cart") ? "text-orange-600" : "text-gray-600"
                }`}
              >
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Profile dropdown */}
            <div className="group relative shrink-0">
              <button
                type="button"
                aria-label="Open profile menu"
                aria-haspopup="true"
                className="flex h-11 w-auto items-center gap-2 rounded-full px-2 py-1 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:px-3"
              >
                {isLoggedIn && userName && (
                  <span className="hidden max-w-28 truncate text-sm text-gray-600 xl:inline">
                    Hi, {userName}
                  </span>
                )}

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition group-hover:bg-orange-200">
                  <UserRound size={21} strokeWidth={1.8} />
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3 w-3 text-gray-500 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="invisible absolute right-0 top-full z-50 w-48 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                  {isLoggedIn ? (
                    <>
                      {userName && (
                        <div className="border-b border-gray-100 px-4 pb-2 pt-1">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="truncate pt-1 text-sm font-semibold text-gray-800">
                            {userName}
                          </p>
                        </div>
                      )}

                      <form action={logoutAction}>
                        <button
                          type="submit"
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                      >
                        <LogIn size={16} />
                        Sign In
                      </Link>

                      <Link
                        href="/register"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                      >
                        <UserRound size={16} />
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile and tablet search */}
        <div className="pb-3 lg:hidden">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="Search products..."
            className="w-full"
          />
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-gray-200 py-2 lg:hidden"
          >
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-md px-3 py-3 text-sm transition-colors hover:bg-orange-50 ${getLinkClass(
                  item.href,
                )}`}
              >
                {item.label}
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                >
                  Cart ({cartItemCount})
                </Link>

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </form>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                >
                  Create Account
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
