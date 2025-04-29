import { CustomCategory } from "@/app/(app)/(home)/types";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";

interface SearchFiltersProps {
	data: CustomCategory[];
}

export const SearchFilters = ({ data }: SearchFiltersProps) => {
	return (
		<div className="flex flex-col gap-4 px-4 lg:px-12 py-8 border-b w-full">
			<SearchInput />
			<Categories data={data} />
		</div>
	);
};
