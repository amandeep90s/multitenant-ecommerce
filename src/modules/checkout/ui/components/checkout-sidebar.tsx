import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CircleXIcon } from "lucide-react";

interface CheckoutSidebarProps {
  totalPrice: number;
  onCheckout: () => void;
  isCancelled: boolean;
  isPending: boolean;
}

export const CheckoutSidebar = ({
  totalPrice,
  onCheckout,
  isCancelled,
  isPending,
}: CheckoutSidebarProps) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <h4 className="text-lg font-medium">Total</h4>
        <p className="text-lg font-medium">{formatCurrency(totalPrice)}</p>
      </div>
      <div className="flex items-center justify-between p-4">
        <Button
          variant={"elevated"}
          disabled={isPending}
          onClick={onCheckout}
          size="lg"
          className="bg-primary hover:text-primary w-full text-base text-white hover:bg-pink-400"
        >
          Checkout
        </Button>
      </div>
      {isCancelled && (
        <div className="flex items-center justify-center border-t p-4">
          <div className="flex w-full items-center rounded border border-red-400 bg-red-100 px-4 py-3 font-medium">
            <div className="flex items-center">
              <CircleXIcon className="mr-2 size-6 fill-red-500 text-red-100" />
              <span>Checkout failed. Please try again</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
