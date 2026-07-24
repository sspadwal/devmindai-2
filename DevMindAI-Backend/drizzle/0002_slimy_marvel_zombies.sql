ALTER TABLE "devmindai" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "devmindai" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "devmindai" ALTER COLUMN "prompt" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "devmindai" ALTER COLUMN "output" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "devmindai" ALTER COLUMN "type" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "devmindai" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "devmindai" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "devmindai" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "devmindai" ALTER COLUMN "updated_at" SET DEFAULT now();