import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      depth: 1, // Populate the subcategories, subcategories[0] will be of type Category
      pagination: false,
      where: {
        parent: { exists: false },
      },
      sort: ["name"],
    });

    // Because of depth 1, we are confident doc will be a type of Category
    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        ...(doc as Category),
        subcategories: undefined,
      })),
    }));

    return formattedData;
  }),
});
