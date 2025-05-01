import { loginSchema, registerSchema } from "@/modules/auth/schemas";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import { AUTH_COOKIE, ERROR_MESSAGES } from "./constants";

// Helper function to set cookies
const setAuthCookie = async (token: string) => {
  const cookies = await getCookies();
  cookies.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    path: "/",
    // TODO: Ensure cross-domain cookie sharing
    // sameSite: "none",
    // domain: ""
  });
};

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

      // Create new user
      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
          username: input.username,
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
      await setAuthCookie(data.token);
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
    await setAuthCookie(data.token);

    return data;
  }),

  logout: baseProcedure.mutation(async () => {
    // Delete authentication cookie
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
  }),
});
