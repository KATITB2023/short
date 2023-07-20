import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const urlRouter = createTRPCRouter({
  getRedirectURL: publicProcedure
    .input(
      z.object({
        source: z.string(),
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
          message: "Shortened link not found",
        });

      return shortenedLink.destination;
    }),

  incrementClicks: publicProcedure
    .input(
      z.object({
        source: z.string(),
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
});
