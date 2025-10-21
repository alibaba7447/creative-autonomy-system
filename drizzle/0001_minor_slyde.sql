CREATE TABLE `cycles` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`phase` enum('exploration','production','consolidation','meta') NOT NULL DEFAULT 'exploration',
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `cycles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_routines` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`date` timestamp NOT NULL,
	`morningCompleted` boolean NOT NULL DEFAULT false,
	`beforeWorkCompleted` boolean NOT NULL DEFAULT false,
	`endOfDayCompleted` boolean NOT NULL DEFAULT false,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `daily_routines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_goals` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`monthlyFloor` int NOT NULL,
	`monthlyExpansion` int NOT NULL,
	`monthlySavings` int NOT NULL,
	`currentMonth` varchar(7) NOT NULL,
	`actualRevenue` int NOT NULL DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `financial_goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_actions` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`completed` boolean NOT NULL DEFAULT false,
	`dueDate` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `project_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('exploration','production','consolidation','completed','paused') NOT NULL DEFAULT 'exploration',
	`satisfactionLevel` int DEFAULT 5,
	`startDate` timestamp DEFAULT (now()),
	`endDate` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quarterly_reflections` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`quarter` varchar(7) NOT NULL,
	`createScore` int DEFAULT 5,
	`teachScore` int DEFAULT 5,
	`earnScore` int DEFAULT 5,
	`alignmentPhrase` text,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `quarterly_reflections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weekly_progress` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`cycleId` varchar(64),
	`weekNumber` int NOT NULL,
	`weekStartDate` timestamp NOT NULL,
	`notes` text,
	`deliverables` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `weekly_progress_id` PRIMARY KEY(`id`)
);
