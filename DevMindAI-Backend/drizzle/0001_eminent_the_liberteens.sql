ALTER TABLE "devmindai" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "devmindai" ADD COLUMN "type" varchar;--> statement-breakpoint
ALTER TABLE "devmindai" DROP COLUMN "article";