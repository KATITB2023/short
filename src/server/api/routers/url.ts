import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createRedirectURLSchema } from "~/schema/url";

export const urlRouter = createTRPCRouter({
  getRedirectURL: publicProcedure
    .input(
      z.object({
        source: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const shortenedLink = await ctx.prisma.shortenedLink.findUnique({
        where: {
          source: input.source,
        },
        select: {
          id: true,
          destination: true,
        },
      });

      if (!shortenedLink)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Requested Link Not Found",
        });

      return shortenedLink.destination;
    }),

  incrementClicks: publicProcedure
    .input(
      z.object({
        source: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.shortenedLink.update({
        where: {
          source: input.source,
        },
        data: {
          clickCount: {
            increment: 1,
          },
        },
      });
    }),

  createRedirectURL: publicProcedure
    .input(createRedirectURLSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.shortenedLink.create({
        data: {
          source: input.source,
          destination: input.destination,
        },
      });
    }),
});
