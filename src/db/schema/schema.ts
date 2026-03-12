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

export const university = mysqlTable("University", {
  id: serial("University_ID").primaryKey(),
  name: varchar("Name", { length: 255 }).notNull(),
  location: varchar("Location", { length: 255 }),
});

export const department = mysqlTable("Department", {
  id: serial("Department_ID").primaryKey(),
  universityId: bigint("University_ID", { mode: "number", unsigned: true }).references(
    () => university.id,
    { onDelete: "cascade" }
  ),
  name: varchar("Name", { length: 255 }).notNull(),
});

export const major = mysqlTable("Major", {
  id: serial("Major_ID").primaryKey(),
  departmentId: bigint("Department_ID", { mode: "number", unsigned: true }).references(
    () => department.id,
    { onDelete: "cascade" }
  ),
  name: varchar("Name", { length: 255 }).notNull(),
  type: varchar("Type", { length: 50 }), // e.g., "BA", "BS"
});

export const reviews = mysqlTable("Reviews", {
  id: serial("Review_ID").primaryKey(),
  userId: varchar("User_ID", { length: 36 }).references(
    () => user.id,
    { onDelete: "cascade" }
  ),
  rating: int("Rating"),
  difficulty: int("Difficulty"),
  comment: text("Comment"),
  majorStatus: varchar("Major_Status", { length: 50 }),
  reviewStatus: varchar("Review_Status", { length: 50 }),
  creationDate: timestamp("Creation_Date").defaultNow(),
  lastUpdated: timestamp("Last_Updated").onUpdateNow(),
});

export const reviewMajors = mysqlTable(
  "Review_Majors",
  {
    majorId: bigint("Major_ID", { mode: "number", unsigned: true })
      .references(() => major.id, { onDelete: "cascade" })
      .notNull(),
    reviewId: bigint("Review_ID", { mode: "number", unsigned: true })
      .references(() => reviews.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.majorId, table.reviewId] }),
    };
  }
);


