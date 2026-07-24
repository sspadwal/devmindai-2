import {
    pgTable,
    serial,
    varchar,
    text,
    timestamp
} from "drizzle-orm/pg-core";

export const schema = pgTable("devmindai", {
    id: serial("id")
        .primaryKey()
        .notNull(),

    user_id: varchar("user_id", {
        length: 255
    }).notNull(),

    prompt: text("prompt")
        .notNull(),

    output: text("output"),

    type: varchar("type", {
        length: 50
    }),

    created_at: timestamp("created_at")
        .defaultNow(),

    updated_at: timestamp("updated_at")
        .defaultNow()
});