import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import z from "zod";
import { AUTH_COOKIE } from "./constants";

export const authRouter = createTRPCRouter({
	session: baseProcedure.query(async ({ ctx }) => {
		const headers = await getHeaders();

		const session = await ctx.db.auth({ headers });

		return session;
	}),
	register: baseProcedure
		.input(
			z.object({
				email: z.string().email(),
				password: z.string().min(8, "Password must be at least 8 characters"),
				username: z
					.string()
					.min(3, "Username must be at least 3 characters")
					.max(63, "Username must be less than 63 characters")
					.regex(
						/^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
						"Username must be lowercase and can only contain letters, numbers, and dashes"
					)
					.refine((val) => !val.includes("--"), "Username cannot contain two consecutive dashes")
					.transform((val) => val.toLowerCase()),
			})
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.create({
				collection: "users",
				data: {
					email: input.email,
					password: input.password,
					username: input.username,
				},
			});

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
					message: "Invalid email or password",
				});
			}

			const cookies = await getCookies();
			cookies.set({
				name: AUTH_COOKIE,
				value: data.token,
				httpOnly: true,
				path: "/",
				// TODO: Ensure cross-domain cookie sharing
				// sameSize: "none",
				// domain: ""
			});
		}),
	login: baseProcedure
		.input(
			z.object({
				email: z.string().email(),
				password: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
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
					message: "Invalid email or password",
				});
			}

			const cookies = await getCookies();
			cookies.set({
				name: AUTH_COOKIE,
				value: data.token,
				httpOnly: true,
				path: "/",
				// TODO: Ensure cross-domain cookie sharing
				// sameSize: "none",
				// domain: ""
			});

			return data;
		}),
	logout: baseProcedure.mutation(async () => {
		const cookies = await getCookies();
		cookies.delete(AUTH_COOKIE);
	}),
});
