import { db } from "@/db/example-db-interaction";
import { department, major } from "@/db/schema/schema";
import { jsonSafe } from "@/lib/utils/json-safe";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const uniId = parseInt(id, 10);

    if (isNaN(uniId)) {
      return NextResponse.json({ message: "Invalid University ID" }, { status: 400 });
    }

    const results = await db
      .select({
        id: department.id,
        name: department.name,
        university_id: department.universityId,
        major_count: sql<number>`count(distinct ${major.id})`,
      })
      .from(department)
      .leftJoin(major, eq(department.id, major.departmentId))
      .where(eq(department.universityId, uniId))
      .groupBy(department.id);

    return NextResponse.json(jsonSafe(results));
  } catch (error) {
    console.error("Failed to fetch departments for university:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
