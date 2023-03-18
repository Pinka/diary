import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      where: {
        user: {
          id: ctx.session.user.id,
        },
      },
    });
  }),
  getByTitle: protectedProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: {
          user: {
            id: ctx.session.user.id,
          },
          title: input.title,
        },
      });

      return post;
    }),
  save: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().nullish(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.upsert({
        where: {
          id: input.id,
        },
        update: {
          content: input.content,
        },
        create: {
          title: input.title ?? new Date().toISOString().slice(0, 10),
          content: input.content,
          userId: ctx.session.user.id,
        },
      });

      return post;
    }),
});
