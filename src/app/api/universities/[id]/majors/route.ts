import { db } from "@/db/example-db-interaction";
import { major, department, university } from "@/db/schema/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const uniId = parseInt(id);

    if (isNaN(uniId)) {
      return NextResponse.json({ message: "Invalid University ID" }, { status: 400 });
    }

    const results = await db
      .select({
        id: major.id,
        name: major.name,
        type: major.type,
        departmentName: department.name,
      })
      .from(major)
      .innerJoin(department, eq(major.departmentId, department.id))
      .where(eq(department.universityId, uniId));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to fetch majors for university:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
