// app/components/search-bar.tsx
"use client";

import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder="Search employees..."
      onChange={(e) => onSearch(e.target.value)}
      className="mb-4"
    />
  );
}
