import "dotenv/config";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { university, department, major, reviews, reviewMajors } from "./schema/schema";
import { user } from "./schema/auth-schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in your environment variables");
}

// Now TS knows connectionString is definitely a string
export const db = drizzle(connectionString);

async function main() {
  console.log("Starting University -> Major -> Review pipeline example...");

  // 1. Create a dummy user (needed for the review's foreign key)
  const newUserId = randomUUID();
  await db.insert(user).values({
    id: newUserId,
    name: "Jane Doe",
    email: "jane.review@example.com",
    emailVerified: true,
    image: null,
    userYear: 2023,
    role: "user",
  });
  const userId = newUserId;
  console.log("1. Created User with ID:", userId);

  // 2. Create University
  const [insertUni] = await db.insert(university).values({
    name: "State University",
    location: "Tech City",
  });
  const uniId = insertUni.insertId;
  console.log("2. Created University with ID:", uniId);

  // 3. Create Department
  const [insertDept] = await db.insert(department).values({
    universityId: uniId,
    name: "Computer Science",
  });
  const deptId = insertDept.insertId;
  console.log("3. Created Department with ID:", deptId);

  // 4. Create Major
  const [insertMajor] = await db.insert(major).values({
    departmentId: deptId,
    name: "Software Engineering",
    type: "BS",
  });
  const majorId = insertMajor.insertId;
  console.log("4. Created Major with ID:", majorId);

  // 5. Create Review
  const [insertReview] = await db.insert(reviews).values({
    userId: userId,
    rating: 5,
    difficulty: 4,
    comment: "Great major, but algorithms was tough!",
    majorStatus: "Graduated",
  });
  const reviewId = insertReview.insertId;
  console.log("5. Created Review with ID:", reviewId);

  // 6. Link Review to Major
  await db.insert(reviewMajors).values({
    majorId: majorId,
    reviewId: reviewId,
  });
  console.log("6. Linked Review to Major!");

  // 7. Query the pipeline to verify relationships utilizing joins
  const majorReviews = await db
    .select({
      universityName: university.name,
      departmentName: department.name,
      majorName: major.name,
      reviewer: user.name,
      rating: reviews.rating,
      comment: reviews.comment,
    })
    .from(reviewMajors)
    .innerJoin(major, eq(reviewMajors.majorId, major.id))
    .innerJoin(department, eq(major.departmentId, department.id))
    .innerJoin(university, eq(department.universityId, university.id))
    .innerJoin(reviews, eq(reviewMajors.reviewId, reviews.id))
    .innerJoin(user, eq(reviews.userId, user.id));

  console.log("\n--- Full Pipeline Query Results ---");
  console.log(majorReviews);
  console.log("-----------------------------------\n");

  // 8. Clean up (Cascading deletes will handle Departments, Majors, Reviews, and Review_Majors automatically)
  // await db.delete(user).where(eq(user.id, userId));
  // await db.delete(university).where(eq(university.id, uniId));
  // console.log("Cleaned up test data!");
}

if (require.main === module) {
  main()
    .then(() => {
      console.log("Example completed successfully!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error in example:", err);
      process.exit(1);
    });
}
// Run with: `npx tsx src/db/example-db-interaction.ts`