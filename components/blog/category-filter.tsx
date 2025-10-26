"use client";

import { Button } from "@/components/ui/button";
import { categories } from "@/lib/mock-data";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="transition-all"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
