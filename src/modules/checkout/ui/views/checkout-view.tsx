"use client";

import { useCart } from "@/modules/checkout/hooks/use-cart";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

interface CheckoutViewProps {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const { productIds, clearAllCarts } = useCart(tenantSlug);
  const trpc = useTRPC();
  const { data, error } = useQuery(
    trpc.checkout.getProducts.queryOptions({ ids: productIds }),
  );

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.warning("Invalid products found, cart cleared");
    }
  }, [clearAllCarts, error]);

  return <h1>{tenantSlug}</h1>;
};
