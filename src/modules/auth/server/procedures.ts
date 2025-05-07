import { loginSchema, registerSchema } from "@/modules/auth/schemas";
import { generateAuthCookie } from "@/modules/auth/utils";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import { ERROR_MESSAGES } from "./constants";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });
    return session;
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if username already exists
      const existingUser = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: { username: { equals: input.username } },
      });

      if (existingUser.docs[0]) {
        throw new TRPCError({
          code: "CONFLICT",
          message: ERROR_MESSAGES.USERNAME_TAKEN,
        });
      }

      // Create new tenant
      const tenant = await ctx.db.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: "mock_stripe_account_id",
        },
      });

      // Create new user
      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
          username: input.username,
          tenants: [
            {
              tenant: tenant.id,
            },
          ],
        },
      });

      // Log in the user after registration
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
      }

      // Set authentication cookie
      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
      });
    }),

  login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    // Authenticate user
    const data = await ctx.db.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Set authentication cookie
    await generateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token,
    });

    return data;
  }),
});
