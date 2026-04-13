import { db } from "@/db/example-db-interaction";
import { major, department, reviewMajors, reviews } from "@/db/schema/schema";
import { jsonSafe } from "@/lib/utils/json-safe";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deptId = parseInt(id, 10);

    if (isNaN(deptId)) {
      return NextResponse.json({ message: "Invalid Department ID" }, { status: 400 });
    }

    const results = await db
      .select({
        id: major.id,
        name: major.name,
        type: major.type,
        department_name: department.name,
        avg_rating: sql<number>`coalesce(round(avg((${reviews.difficulty} + ${reviews.contentScore} + ${reviews.professorsScore} + ${reviews.advisorsScore}) / 4), 2), 0)`,
      })
      .from(major)
      .innerJoin(department, eq(major.departmentId, department.id))
      .leftJoin(reviewMajors, eq(reviewMajors.majorId, major.id))
      .leftJoin(reviews, eq(reviewMajors.reviewId, reviews.id))
      .where(eq(major.departmentId, deptId))
      .groupBy(major.id, department.name);

    return NextResponse.json(jsonSafe(results));
  } catch (error) {
    console.error("Failed to fetch majors for department:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
