import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { Category } from "@/payload-types";
import Link from "next/link";

interface SubCategoryMenuProps {
  category: CategoriesGetManyOutput[1];
  isOpen: boolean;
  position: {
    left: number;
    top: number;
  };
}

export const SubCategoryMenu = ({
  category,
  isOpen,
  position,
}: SubCategoryMenuProps) => {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  const backgroundColor = category.color || "#f5f5f5";

  return (
    <div
      className="fixed z-100"
      style={{ top: position.top, left: position.left }}
    >
      {/* Invisible bridge to maintain hover */}
      <div className="h-3 w-60"></div>
      <div
        style={{ backgroundColor }}
        className="w-60 -translate-x-[2px] -translate-y-[2px] overflow-hidden rounded-md border bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div>
          {category.subcategories.map((subcategory: Category) => (
            <Link
              href={`/${category.slug}/${subcategory.slug}`}
              key={subcategory.slug}
              className="flex w-full items-center justify-between p-4 text-left font-medium underline hover:bg-black hover:text-white"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
