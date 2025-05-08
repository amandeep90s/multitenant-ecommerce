import { DEFAULT_CURSOR, DEFAULT_LIMIT, sortValues } from "@/constants";
import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import z from "zod";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(DEFAULT_CURSOR), // Pagination cursor
        limit: z.number().default(DEFAULT_LIMIT), // Number of items per page
        category: z.string().nullable().optional(), // Filter by category slug
        minPrice: z.string().nullable().optional(), // Minimum price filter
        maxPrice: z.string().nullable().optional(), // Maximum price filter
        tags: z.array(z.string()).nullable().optional(), // Filter by tags
        sort: z.enum(sortValues).nullable().optional(), // Sorting options
        tenantSlug: z.string().nullable().optional(), // Filter by tenant slug
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = { price: {} }; // Initialize the `where` filter
      let sort: Sort = "-createdAt"; // Default sorting by newest first

      // Handle sorting options
      if (input.sort === "hot_and_new") {
        sort = "+createdAt"; // Sort by oldest first
      }

      if (input.sort === "trending") {
        sort = "-createdAt"; // Sort by newest first
      }

      // Handle price range filters
      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = { greater_than_equal: input.minPrice };
      } else if (input.maxPrice) {
        where.price = { less_than_equal: input.maxPrice };
      }

      // Handle tag filters
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = { in: input.tags };
      }

      // Filter by tenant slug
      if (input.tenantSlug) {
        where["tenant.slug"] = { equals: input.tenantSlug };
      }

      // Handle category filters
      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: { slug: { equals: input.category } },
        });

        // Format category data and extract subcategories
        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subcategories: undefined, // Avoid nested subcategories
          })),
        }));

        const subcategoriesSlugs = [];
        const parentCategory = formattedData[0];
        if (parentCategory) {
          subcategoriesSlugs.push(
            ...(parentCategory?.subcategories?.map(
              (subcategory) => subcategory.slug,
            ) ?? []),
          );

          // Include parent category and subcategories in the filter
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }

      // Fetch products from the database
      const data = await ctx.db.find({
        collection: "products",
        depth: 2, // Populate related fields (e.g., category, image)
        where,
        sort,
        page: input.cursor, // Pagination cursor
        limit: input.limit, // Number of items per page
      });

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
