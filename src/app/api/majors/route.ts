import { db } from "@/db/example-db-interaction";
import { major, department, university } from "@/db/schema/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const universityId = searchParams.get("universityId");

    let query = db
      .select({
        id: major.id,
        name: major.name,
        type: major.type,
        departmentName: department.name,
        universityName: university.name,
      })
      .from(major)
      .innerJoin(department, eq(major.departmentId, department.id))
      .innerJoin(university, eq(department.universityId, university.id));

    if (universityId) {
      const uniId = parseInt(universityId);
      if (!isNaN(uniId)) {
        // @ts-ignore - drizzle type narrowing
        query = query.where(eq(university.id, uniId));
      }
    }

    const results = await query;
    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to fetch majors:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
