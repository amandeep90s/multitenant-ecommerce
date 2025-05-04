import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

interface TagsFilterProps {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const trpc = useTRPC();
  const {
    data: tags,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.tags.getMany.infiniteQueryOptions(
      { limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      },
    ),
  );

  const handleTagChange = (tag: string) => {
    if (value?.includes(tag)) {
      onChange(value?.filter((t) => t !== tag) || []);
    } else {
      onChange([...(value || []), tag]);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        tags?.pages.map((page) =>
          page.docs.map((tag) => (
            <div className="flex items-center justify-between" key={tag.id}>
              <button
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleTagChange(tag?.name)}
              >
                <p className="font-medium">{tag.name}</p>
              </button>
              <Checkbox
                className="cursor-pointer"
                checked={value?.includes(tag.name)}
                onCheckedChange={() => handleTagChange(tag.name)}
              />
            </div>
          )),
        )
      )}
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="justify-start font-medium underline cursor-pointer text-start disabled:opacity-50"
        >
          Load more...
        </button>
      )}
    </div>
  );
};
