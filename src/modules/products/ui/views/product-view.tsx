"use client";

import { StarRating } from "@/components/star-rating";
import { formatCurrency, generateTenantUrl } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId }),
  );

  return (
    <div className="px-4 py-10 lg:px-12">
      <div className="overflow-hidden rounded-sm border bg-white">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={data.image?.url ?? "/placeholder.png"}
            alt={data.name}
            fill
            className="object-cover"
            priority={true}
          />
        </div>

        <div className="grid-cols grid lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{data.name}</h1>
            </div>
            <div className="flex border-y">
              <div className="flex items-center justify-center border-r px-6 py-4">
                <div className="w-fit border bg-pink-400 px-2 py-1">
                  <p className="text-base font-medium">
                    {formatCurrency(data.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center px-6 py-4 lg:border-r">
                <Link
                  href={generateTenantUrl(tenantSlug)}
                  className="flex items-center gap-2"
                >
                  {data.tenant.image?.url && (
                    <Image
                      src={data.tenant.image?.url}
                      alt={data.tenant.name}
                      width={20}
                      height={20}
                      className="size-[20px] shrink-0 rounded-full border"
                    />
                  )}
                  <p className="text-base font-medium underline">
                    {data.tenant.name}
                  </p>
                </Link>
              </div>

              <div className="hidden items-center justify-center px-6 py-4 lg:flex">
                <div className="flex items-center gap-1">
                  <StarRating rating={3} iconClassName="size-4" />
                </div>
              </div>
            </div>

            <div className="block items-center justify-center border-b px-6 py-4 lg:hidden">
              <div className="flex items-center gap-1">
                <StarRating rating={3} iconClassName="size-4" />
                <p className="text-base font-medium">{5} ratings</p>
              </div>
            </div>

            <div className="p-6">
              {data.description ? (
                <p>{data.description}</p>
              ) : (
                <p className="text-muted-foreground font-medium italic">
                  No description provided
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
