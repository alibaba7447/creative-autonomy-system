CREATE TABLE `expenses` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`date` timestamp NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revenue_sources` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`frequency` enum('once','daily','weekly','monthly','yearly') NOT NULL DEFAULT 'monthly',
	`description` text,
	`date` timestamp NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `revenue_sources_id` PRIMARY KEY(`id`)
);
