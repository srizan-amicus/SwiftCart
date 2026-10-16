"use client";

import { Search } from "lucide-react";

import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/constants/button-variants";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search",
  className = "",
}: SearchBarProps) {
  return (
    <form
      className={`relative flex min-w-0 flex-1 ${className}`}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded border border-gray-300 bg-white px-4 pr-12 text-sm text-gray-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />

      <Button
        type="submit"
        variant={ButtonVariant.Compact}
        ariaLabel="Search"
        className="absolute right-0 top-0 !h-10 !min-h-10 !w-11 !min-w-0 !rounded-none !px-0 !py-0 text-orange-500 hover:bg-orange-50"
      >
        <Search size={20} strokeWidth={2} aria-hidden="true" />
      </Button>
    </form>
  );
}
