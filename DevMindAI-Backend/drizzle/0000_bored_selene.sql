CREATE TABLE "devmindai" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"prompt" varchar NOT NULL,
	"output" varchar,
	"article" varchar,
	"created_at" date,
	"updated_at" date
);
