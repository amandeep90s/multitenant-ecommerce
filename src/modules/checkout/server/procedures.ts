import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Fetch products from the database
      const data = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          id: { in: input.ids },
        },
      });

      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      // Format the response to include populated fields
      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null, // Cast image field
          tenant: doc.tenant as Tenant & { image: Media | null }, // Cast tenant field
        })),
      };
    }),
});
