import { db } from "@/db/example-db-interaction";
import { university, department, major } from "@/db/schema/schema";
import { jsonSafe } from "@/lib/utils/json-safe";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const results = await db
      .select({
        id: university.id,
        name: university.name,
        location: university.location,
        departmentCount: sql<number>`count(distinct ${department.id})`,
        majorCount: sql<number>`count(distinct ${major.id})`,
      })
      .from(university)
      .leftJoin(department, eq(university.id, department.universityId))
      .leftJoin(major, eq(department.id, major.departmentId))
      .groupBy(university.id);

    return NextResponse.json(jsonSafe(results));
  } catch (error) {
    console.error("Failed to fetch universities:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
