import { CustomCategory } from "@/app/(app)/(home)/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategorySidebarProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	data: CustomCategory[];
}

export const CategorySidebar = ({ open, onOpenChange, data }: CategorySidebarProps) => {
	const router = useRouter();
	const [parentCategories, setParentCategories] = useState<CustomCategory[] | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<CustomCategory | null>(null);

	// If we have parent categories, show those, otherwise show root categories
	const currentCategories = parentCategories ?? data ?? [];

	const handleOpenChange = (open: boolean) => {
		setParentCategories(null);
		setSelectedCategory(null);
		onOpenChange(open);
	};

	const handleCategoryClick = (category: CustomCategory) => {
		if (category?.subcategories?.length > 0) {
			setParentCategories(category.subcategories as CustomCategory[]);
			setSelectedCategory(category);
		} else {
			// This is a leaf category, so we can navigate to it
			if (parentCategories && selectedCategory) {
				// This is a subcategory - navigate to /category/subcategory
				router.push(`/${selectedCategory.slug}/${category.slug}`);
			} else {
				// This is a root category - naviagte to /category
				if (category.slug === "all") {
					router.push("/");
				} else {
					router.push(`/${category.slug}`);
				}
			}
			handleOpenChange(false);
		}
	};

	const handleBackClick = () => {
		if (parentCategories) {
			setParentCategories(null);
			setSelectedCategory(null);
		}
	};

	const backgroundColor = selectedCategory?.color || "white";

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent side="left" className="p-0 transition-none" style={{ backgroundColor }}>
				<SheetHeader className="p-4 border-b">
					<SheetTitle>Categories</SheetTitle>
				</SheetHeader>
				<ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
					{parentCategories && (
						<button
							onClick={handleBackClick}
							className="w-full text-left p-4 hover:bg-black hover:text-white flex cursor-pointer items-center text-base font-medium"
						>
							<ChevronLeftIcon className="size-4 mr-2" />
							Back
						</button>
					)}
					{currentCategories.map((category) => (
						<button
							key={category.slug}
							className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center cursor-pointer justify-between text-base font-medium"
							onClick={() => handleCategoryClick(category)}
						>
							{category.name}
							{category?.subcategories?.length > 0 && <ChevronRightIcon className="size-4" />}
						</button>
					))}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};
