import { CustomCategory } from "@/app/(app)/(home)/types";
import { Category } from "@/payload-types";
import Link from "next/link";

interface SubCategoryMenuProps {
	category: CustomCategory;
	isOpen: boolean;
	position: {
		left: number;
		top: number;
	};
}

export const SubCategoryMenu = ({ category, isOpen, position }: SubCategoryMenuProps) => {
	if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
		return null;
	}

	const backgroundColor = category.color || "#f5f5f5";

	return (
		<div className="fixed z-100" style={{ top: position.top, left: position.left }}>
			{/* Invisible bridge to maintain hover */}
			<div className="h-3 w-60"></div>
			<div
				style={{ backgroundColor }}
				className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px] bg-white"
			>
				<div>
					{category.subcategories.map((subcategory: Category) => (
						<Link
							href={`/${category.slug}/${subcategory.slug}`}
							key={subcategory.slug}
							className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
						>
							{subcategory.name}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};
