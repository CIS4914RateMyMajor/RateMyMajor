import { db } from "@/db/example-db-interaction";
import { major, department, university, reviewMajors, reviews } from "@/db/schema/schema";
import { jsonSafe } from "@/lib/utils/json-safe";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const majorId = parseInt(id, 10);

    if (isNaN(majorId)) {
      return NextResponse.json({ message: "Invalid Major ID" }, { status: 400 });
    }

    const rows = await db
      .select({
        id: major.id,
        name: major.name,
        type: major.type,
        dept_id: department.id,
        department_name: department.name,
        university_id: university.id,
        university_name: university.name,
        review_count: sql<number>`count(distinct ${reviews.id})`,
        avg_rating: sql<number>`coalesce(round(avg(${reviews.rating}), 2), 0)`,
        avg_difficulty: sql<number>`coalesce(round(avg(${reviews.difficulty}), 2), 0)`,
      })
      .from(major)
      .innerJoin(department, eq(major.departmentId, department.id))
      .innerJoin(university, eq(department.universityId, university.id))
      .leftJoin(reviewMajors, eq(reviewMajors.majorId, major.id))
      .leftJoin(reviews, eq(reviewMajors.reviewId, reviews.id))
      .where(eq(major.id, majorId))
      .groupBy(major.id, department.id, university.id)
      .limit(1);

    const current = rows[0];
    if (!current) {
      return NextResponse.json({ message: "Major not found" }, { status: 404 });
    }

    return NextResponse.json(jsonSafe(current));
  } catch (error) {
    console.error("Failed to fetch major details:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
