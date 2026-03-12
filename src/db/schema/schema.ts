import {
  int,
  mysqlTable,
  serial,
  varchar,
  timestamp,
  text,
  primaryKey,
  bigint,
} from "drizzle-orm/mysql-core";
import { user } from "./auth-schema";

export const university = mysqlTable("university", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
});

export const department = mysqlTable("department", {
  id: serial("id").primaryKey(),
  universityId: bigint("university_id", { mode: "number", unsigned: true }).notNull().references(
    () => university.id,
    { onDelete: "cascade" }
  ),
  name: varchar("name", { length: 255 }).notNull(),
});

export const major = mysqlTable("major", {
  id: serial("id").primaryKey(),
  departmentId: bigint("department_id", { mode: "number", unsigned: true }).notNull().references(
    () => department.id,
    { onDelete: "cascade" }
  ),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }), // e.g., "BA", "BS"
});

export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  rating: int("rating"),
  difficulty: int("difficulty"),
  comment: text("comment"),
  majorStatus: varchar("major_status", { length: 50 }),
  reviewStatus: varchar("review_status", { length: 50 }),
  creationDate: timestamp("creation_date").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow().onUpdateNow().notNull(),
});

export const reviewMajors = mysqlTable(
  "review_majors",
  {
    majorId: bigint("major_id", { mode: "number", unsigned: true }).references(() => major.id, { onDelete: "cascade" }).notNull(),
    reviewId: bigint("review_id", { mode: "number", unsigned: true }).references(() => reviews.id, { onDelete: "cascade" }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.majorId, table.reviewId] }),
    };
  }
);


