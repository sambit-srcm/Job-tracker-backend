CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'Applied' NOT NULL,
	"work_type" varchar(10) DEFAULT 'Remote' NOT NULL,
	"location" varchar(255),
	"date" date NOT NULL,
	"notes" text DEFAULT '',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "status_check" CHECK ("applications"."status" IN ('Applied', 'Interviewing', 'Hired', 'Rejected')),
	CONSTRAINT "work_type_check" CHECK ("applications"."work_type" IN ('Remote', 'Hybrid', 'Onsite')),
	CONSTRAINT "location_required_unless_remote" CHECK ("applications"."work_type" = 'Remote' OR ("applications"."location" IS NOT NULL AND btrim("applications"."location") <> ''))
);
--> statement-breakpoint
DROP TABLE "jobs" CASCADE;--> statement-breakpoint
CREATE INDEX "idx_applications_status" ON "applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_applications_date" ON "applications" USING btree ("date" DESC NULLS LAST);