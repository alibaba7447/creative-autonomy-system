import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  financialGoals: router({
    get: protectedProcedure
      .input(z.object({ currentMonth: z.string() }))
      .query(async ({ ctx, input }) => {
        return await db.getFinancialGoal(ctx.user.id, input.currentMonth);
      }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserFinancialGoals(ctx.user.id);
    }),

    upsert: protectedProcedure
      .input(z.object({
        currentMonth: z.string(),
        monthlyFloor: z.number(),
        monthlyExpansion: z.number(),
        monthlySavings: z.number(),
        actualRevenue: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertFinancialGoal({
          id: nanoid(),
          userId: ctx.user.id,
          ...input,
          actualRevenue: input.actualRevenue ?? 0,
        });
        return { success: true };
      }),
  }),

  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserProjects(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getProject(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z.enum(["exploration", "production", "consolidation", "completed", "paused"]).optional(),
        satisfactionLevel: z.number().min(1).max(10).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = nanoid();
        await db.createProject({
          id,
          userId: ctx.user.id,
          ...input,
        });
        return { id, success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["exploration", "production", "consolidation", "completed", "paused"]).optional(),
        satisfactionLevel: z.number().min(1).max(10).optional(),
        endDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateProject(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteProject(input.id);
        return { success: true };
      }),
  }),

  projectActions: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ input }) => {
        return await db.getProjectActions(input.projectId);
      }),

    create: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.createProjectAction({
          id,
          ...input,
        });
        return { id, success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        completed: z.boolean().optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateProjectAction(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteProjectAction(input.id);
        return { success: true };
      }),
  }),

  cycles: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserCycles(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getCycle(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        phase: z.enum(["exploration", "production", "consolidation", "meta"]).optional(),
        startDate: z.date(),
        endDate: z.date(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = nanoid();
        await db.createCycle({
          id,
          userId: ctx.user.id,
          ...input,
        });
        return { id, success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        phase: z.enum(["exploration", "production", "consolidation", "meta"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateCycle(id, updates);
        return { success: true };
      }),
  }),

  weeklyProgress: router({
    list: protectedProcedure
      .input(z.object({ cycleId: z.string() }))
      .query(async ({ input }) => {
        return await db.getCycleWeeklyProgress(input.cycleId);
      }),

    upsert: protectedProcedure
      .input(z.object({
        cycleId: z.string(),
        weekNumber: z.number().min(1).max(6),
        weekStartDate: z.date(),
        notes: z.string().optional(),
        deliverables: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertWeeklyProgress({
          id: nanoid(),
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  quarterlyReflections: router({
    get: protectedProcedure
      .input(z.object({ quarter: z.string() }))
      .query(async ({ ctx, input }) => {
        return await db.getQuarterlyReflection(ctx.user.id, input.quarter);
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserQuarterlyReflections(ctx.user.id);
    }),

    upsert: protectedProcedure
      .input(z.object({
        quarter: z.string(),
        createScore: z.number().min(1).max(10).optional(),
        teachScore: z.number().min(1).max(10).optional(),
        earnScore: z.number().min(1).max(10).optional(),
        alignmentPhrase: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertQuarterlyReflection({
          id: nanoid(),
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  dailyRoutines: router({
    get: protectedProcedure
      .input(z.object({ date: z.date() }))
      .query(async ({ ctx, input }) => {
        return await db.getDailyRoutine(ctx.user.id, input.date);
      }),

    list: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getUserDailyRoutines(ctx.user.id, input.limit);
      }),

    upsert: protectedProcedure
      .input(z.object({
        date: z.date(),
        morningCompleted: z.boolean().optional(),
        beforeWorkCompleted: z.boolean().optional(),
        endOfDayCompleted: z.boolean().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertDailyRoutine({
          id: nanoid(),
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

