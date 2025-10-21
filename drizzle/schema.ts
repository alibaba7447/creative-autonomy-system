import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Financial tracking - Plancher & Plafond
 */
export const financialGoals = mysqlTable("financial_goals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  monthlyFloor: int("monthlyFloor").notNull(), // Plancher mensuel
  monthlyExpansion: int("monthlyExpansion").notNull(), // Objectif d'expansion
  monthlySavings: int("monthlySavings").notNull(), // Épargne mensuelle
  currentMonth: varchar("currentMonth", { length: 7 }).notNull(), // Format: YYYY-MM
  actualRevenue: int("actualRevenue").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type FinancialGoal = typeof financialGoals.$inferSelect;
export type InsertFinancialGoal = typeof financialGoals.$inferInsert;

/**
 * Projects portfolio - Règle du 3x3
 */
export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["exploration", "production", "consolidation", "completed", "paused"]).default("exploration").notNull(),
  satisfactionLevel: int("satisfactionLevel").default(5), // 1-10
  startDate: timestamp("startDate").defaultNow(),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Project actions - 3 actions par projet
 */
export const projectActions = mysqlTable("project_actions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type ProjectAction = typeof projectActions.$inferSelect;
export type InsertProjectAction = typeof projectActions.$inferInsert;

/**
 * 6-week cycles
 */
export const cycles = mysqlTable("cycles", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  phase: mysqlEnum("phase", ["exploration", "production", "consolidation", "meta"]).default("exploration").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Cycle = typeof cycles.$inferSelect;
export type InsertCycle = typeof cycles.$inferInsert;

/**
 * Weekly progress tracking
 */
export const weeklyProgress = mysqlTable("weekly_progress", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  cycleId: varchar("cycleId", { length: 64 }),
  weekNumber: int("weekNumber").notNull(), // 1-6
  weekStartDate: timestamp("weekStartDate").notNull(),
  notes: text("notes"),
  deliverables: text("deliverables"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type WeeklyProgress = typeof weeklyProgress.$inferSelect;
export type InsertWeeklyProgress = typeof weeklyProgress.$inferInsert;

/**
 * Quarterly reflections - Tableau de sens
 */
export const quarterlyReflections = mysqlTable("quarterly_reflections", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  quarter: varchar("quarter", { length: 7 }).notNull(), // Format: YYYY-Q1
  createScore: int("createScore").default(5), // 1-10
  teachScore: int("teachScore").default(5), // 1-10
  earnScore: int("earnScore").default(5), // 1-10
  alignmentPhrase: text("alignmentPhrase"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type QuarterlyReflection = typeof quarterlyReflections.$inferSelect;
export type InsertQuarterlyReflection = typeof quarterlyReflections.$inferInsert;

/**
 * Daily routines tracking
 */
export const dailyRoutines = mysqlTable("daily_routines", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  date: timestamp("date").notNull(),
  morningCompleted: boolean("morningCompleted").default(false).notNull(),
  beforeWorkCompleted: boolean("beforeWorkCompleted").default(false).notNull(),
  endOfDayCompleted: boolean("endOfDayCompleted").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type DailyRoutine = typeof dailyRoutines.$inferSelect;
export type InsertDailyRoutine = typeof dailyRoutines.$inferInsert;

