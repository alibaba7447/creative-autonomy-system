import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  financialGoals, InsertFinancialGoal,
  projects, InsertProject,
  projectActions, InsertProjectAction,
  cycles, InsertCycle,
  weeklyProgress, InsertWeeklyProgress,
  quarterlyReflections, InsertQuarterlyReflection,
  dailyRoutines, InsertDailyRoutine
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Financial Goals
export async function upsertFinancialGoal(goal: InsertFinancialGoal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(financialGoals).values(goal).onDuplicateKeyUpdate({
    set: {
      monthlyFloor: goal.monthlyFloor,
      monthlyExpansion: goal.monthlyExpansion,
      monthlySavings: goal.monthlySavings,
      actualRevenue: goal.actualRevenue,
      updatedAt: new Date(),
    },
  });
}

export async function getFinancialGoal(userId: string, currentMonth: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(financialGoals)
    .where(and(eq(financialGoals.userId, userId), eq(financialGoals.currentMonth, currentMonth)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserFinancialGoals(userId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(financialGoals)
    .where(eq(financialGoals.userId, userId))
    .orderBy(desc(financialGoals.currentMonth));
}

// Projects
export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(projects).values(project);
}

export async function updateProject(id: string, updates: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(projects).set({ ...updates, updatedAt: new Date() }).where(eq(projects.id, id));
}

export async function deleteProject(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(projects).where(eq(projects.id, id));
}

export async function getUserProjects(userId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt));
}

export async function getProject(id: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Project Actions
export async function createProjectAction(action: InsertProjectAction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(projectActions).values(action);
}

export async function updateProjectAction(id: string, updates: Partial<InsertProjectAction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(projectActions).set({ ...updates, updatedAt: new Date() }).where(eq(projectActions.id, id));
}

export async function deleteProjectAction(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(projectActions).where(eq(projectActions.id, id));
}

export async function getProjectActions(projectId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(projectActions)
    .where(eq(projectActions.projectId, projectId))
    .orderBy(desc(projectActions.createdAt));
}

// Cycles
export async function createCycle(cycle: InsertCycle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(cycles).values(cycle);
}

export async function updateCycle(id: string, updates: Partial<InsertCycle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(cycles).set({ ...updates, updatedAt: new Date() }).where(eq(cycles.id, id));
}

export async function getUserCycles(userId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cycles)
    .where(eq(cycles.userId, userId))
    .orderBy(desc(cycles.startDate));
}

export async function getCycle(id: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(cycles).where(eq(cycles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteCycle(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cycles).where(eq(cycles.id, id));
}

// Weekly Progress
export async function upsertWeeklyProgress(progress: InsertWeeklyProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(weeklyProgress).values(progress).onDuplicateKeyUpdate({
    set: {
      notes: progress.notes,
      deliverables: progress.deliverables,
      updatedAt: new Date(),
    },
  });
}

export async function getCycleWeeklyProgress(cycleId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(weeklyProgress)
    .where(eq(weeklyProgress.cycleId, cycleId))
    .orderBy(weeklyProgress.weekNumber);
}

// Quarterly Reflections
export async function upsertQuarterlyReflection(reflection: InsertQuarterlyReflection) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(quarterlyReflections).values(reflection).onDuplicateKeyUpdate({
    set: {
      createScore: reflection.createScore,
      teachScore: reflection.teachScore,
      earnScore: reflection.earnScore,
      alignmentPhrase: reflection.alignmentPhrase,
      notes: reflection.notes,
      updatedAt: new Date(),
    },
  });
}

export async function getQuarterlyReflection(userId: string, quarter: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(quarterlyReflections)
    .where(and(eq(quarterlyReflections.userId, userId), eq(quarterlyReflections.quarter, quarter)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserQuarterlyReflections(userId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(quarterlyReflections)
    .where(eq(quarterlyReflections.userId, userId))
    .orderBy(desc(quarterlyReflections.quarter));
}

// Daily Routines
export async function upsertDailyRoutine(routine: InsertDailyRoutine) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(dailyRoutines).values(routine).onDuplicateKeyUpdate({
    set: {
      morningCompleted: routine.morningCompleted,
      beforeWorkCompleted: routine.beforeWorkCompleted,
      endOfDayCompleted: routine.endOfDayCompleted,
      notes: routine.notes,
      updatedAt: new Date(),
    },
  });
}

export async function getDailyRoutine(userId: string, date: Date) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(dailyRoutines)
    .where(and(eq(dailyRoutines.userId, userId), eq(dailyRoutines.date, date)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserDailyRoutines(userId: string, limit: number = 30) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(dailyRoutines)
    .where(eq(dailyRoutines.userId, userId))
    .orderBy(desc(dailyRoutines.date))
    .limit(limit);
}

