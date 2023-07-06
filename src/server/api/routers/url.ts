import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const urlRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  createURL: publicProcedure.input(z.object({
    url: z.string().url(),
    slug: z.string().optional(),
  })).query(async ({ ctx, input }) => {
    let slug: string
    if (!input.slug) {
      slug = Math.random().toString(36).substring(2, 7);
    } else {
      slug = input.slug;
    }
    const existing = await ctx.prisma.url.findUnique({
      where: {
        slug,
      },
    });
    if (existing) {
      throw new Error("Slug already in use");
    }
    const url = await ctx.prisma.url.create({
      data: {
        url: input.url,
        slug,
      },
    });
    if (!url) {
      throw new Error("Error creating URL");
    }
    return {
      originalLink: url.url,
      shortLink: env.HOST_URL + `${url.slug}`,
    };
  }),
});
