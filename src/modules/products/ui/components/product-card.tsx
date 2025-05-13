import { formatCurrency, generateTenantUrl } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reivewRating: number;
  reviewCount: number;
  price: number;
}

export const ProductCard = ({
  id,
  name,
  price,
  reivewRating,
  reviewCount,
  tenantSlug,
  tenantImageUrl,
  imageUrl,
}: ProductCardProps) => {
  const router = useRouter();

  const handleAuthorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(generateTenantUrl(tenantSlug));
  };

  return (
    <Link href={`${generateTenantUrl(tenantSlug)}/products/${id}`}>
      <div className="flex h-full flex-col overflow-hidden rounded-md border bg-white transition-shadow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative aspect-square">
          <Image
            src={imageUrl ?? "/placeholder.png"}
            alt={name}
            className="object-cover"
            fill
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 border-y p-4">
          <h2 className="line-clamp-4 text-lg font-medium">{name}</h2>
          <button
            onClick={handleAuthorClick}
            className="flex cursor-pointer items-center gap-2"
          >
            {tenantImageUrl && (
              <Image
                width={16}
                height={16}
                src={tenantImageUrl}
                alt={tenantSlug}
                className="size-[16px] shrink-0 rounded-full border"
              />
            )}
            <p className="text-sm font-medium underline">{tenantSlug}</p>
          </button>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-black" />
              <p className="text-sm font-medium">
                {reivewRating} ({reviewCount})
              </p>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="relative w-fit border bg-pink-400 px-2 py-1">
            <p className="text-sm font-medium">{formatCurrency(price)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="aspect-3/4 w-full animate-pulse rounded-lg bg-neutral-200" />
  );
};
