"use client";

import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import BreadcrumbNavigation from "./breadcrumbs-navigation";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const params = useParams();
  const isCategoryPage = params.category as string | undefined;
  const activeCategory = isCategoryPage ?? "all";
  const activeCategoryData = data.find((item) => item.slug === activeCategory);
  const activeCategoryColor = activeCategoryData?.color ?? DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name ?? null;

  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryName =
    activeCategoryData?.subcategories.find(
      (item) => item.slug === activeSubcategory,
    )?.name ?? null;

  return (
    <div
      className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12"
      style={{ backgroundColor: activeCategoryColor }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  );
};

export const SearchFiltersSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4 border-b bg-[#f5f5f5] px-4 py-8 lg:px-12">
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
