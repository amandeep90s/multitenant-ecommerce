"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { CategorySidebar } from "./category-sidebar";

interface SearchInputProps {
	disabled?: boolean;
}

export const SearchInput = ({ disabled }: SearchInputProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="flex items-center gap-2 w-full">
			<CategorySidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
			<div className="relative w-full">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
				<Input className="pl-8" placeholder="Search products" disabled={disabled} />
			</div>
			<Button variant={"elevated"} className="size-12 shrink-0 flex lg:hidden" onClick={() => setIsSidebarOpen(true)}>
				<ListFilterIcon />
			</Button>
			{/* TODO: Add library button */}
		</div>
	);
};
