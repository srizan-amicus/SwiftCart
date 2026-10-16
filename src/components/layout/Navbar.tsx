"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

import SearchBar from "@/components/common/SearchBar";

interface NavbarProps {
  cartItemCount?: number;
}

export default function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Temporary placeholders until authentication is connected.
  const isLoggedIn = false;
  const userName = "";

  function handleSearch() {
    const query = searchTerm.trim();

    router.push(
      query ? `/products?search=${encodeURIComponent(query)}` : "/products",
    );

    setMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    ...(isLoggedIn
      ? [
          { label: "Orders", href: "/orders" },
          { label: "Checkout", href: "/checkout" },
        ]
      : []),
  ];

  function getLinkClass(href: string) {
    return `whitespace-nowrap transition-colors hover:text-orange-600 ${
      isActive(href) ? "font-bold text-orange-600" : "font-medium text-gray-600"
    }`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1280px] px-3 sm:px-4">
        <div className="flex h-16 items-center gap-3 lg:gap-5">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-orange-600 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
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
            className="ml-auto hidden shrink-0 items-center gap-4 text-sm lg:flex xl:gap-5"
          >
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getLinkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Cart */}
          {isLoggedIn && (
            <Link
              href="/cart"
              aria-label={`Shopping cart, ${cartItemCount} items`}
              className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center transition-colors hover:text-orange-600 ${
                isActive("/cart") ? "text-orange-600" : "text-gray-600"
              }`}
            >
              <ShoppingCart size={23} />

              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>
          )}

          {/* Profile dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-label="Toggle profile menu"
              aria-expanded={profileOpen}
              className="flex h-11 items-center gap-2 rounded-full px-1.5 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:px-2"
            >
              {isLoggedIn && userName && (
                <span className="hidden max-w-28 truncate text-sm font-semibold text-gray-600 xl:inline">
                  Hi, {userName}
                </span>
              )}

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <UserRound size={22} strokeWidth={1.8} />
              </span>

              <ChevronDown
                size={13}
                className={`hidden text-gray-500 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
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

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        // Connect the authentication logout function here.
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    <LogIn size={16} />
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search on mobile and tablet */}
        <div className="pb-3 lg:hidden">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="Search by product name or keyword"
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
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              >
                Cart ({cartItemCount})
              </Link>
            )}

            {!isLoggedIn && (
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              >
                Create Account
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
