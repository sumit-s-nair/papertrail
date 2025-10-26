"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories = [], isLoading } = trpc.category.getAll.useQuery();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading categories...</div>;
  }

  const allCategories = ["All", ...categories.map((c) => c.name)];

  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
    
    // Update URL query parameter
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category.toLowerCase());
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/blog?${queryString}` : "/blog", { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(category)}
          className="transition-all"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
