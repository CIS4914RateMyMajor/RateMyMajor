import { auth } from "@/lib/auth";
import { db } from "@/db/example-db-interaction";
import { user } from "@/db/schema/auth-schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

async function getSessionUserId(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  return session?.user?.id || null;
}

export async function GET(req: Request) {
  const userId = await getSessionUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  const current = rows[0];

  if (!current) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    username: current.name,
    email: current.email,
    major: current.major,
    college: current.college,
    gpa: current.gpa,
    grad_year: current.userYear,
    bio: current.bio,
    image: current.image,
  });
}

export async function PATCH(req: Request) {
  const userId = await getSessionUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: {
    username?: string;
    major?: string;
    college?: string;
    gpa?: string;
    grad_year?: number;
    bio?: string;
    image?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const updatePayload: Partial<{
    name: string;
    major: string;
    college: string;
    gpa: string;
    userYear: number;
    bio: string;
    image: string;
  }> = {};
  if (body.username !== undefined) updatePayload.name = body.username;
  if (body.major !== undefined) updatePayload.major = body.major;
  if (body.college !== undefined) updatePayload.college = body.college;
  if (body.gpa !== undefined) updatePayload.gpa = body.gpa;
  if (body.grad_year !== undefined) updatePayload.userYear = body.grad_year;
  if (body.bio !== undefined) updatePayload.bio = body.bio;
  if (body.image !== undefined) updatePayload.image = body.image;

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ message: "No fields to update" }, { status: 400 });
  }

  await db.update(user).set(updatePayload).where(eq(user.id, userId));

  const rows = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  const updated = rows[0];

  if (!updated) {
    return NextResponse.json({ message: "User not found after update" }, { status: 404 });
  }

  return NextResponse.json({
    username: updated.name,
    email: updated.email,
    major: updated.major,
    college: updated.college,
    gpa: updated.gpa,
    grad_year: updated.userYear,
    bio: updated.bio,
    image: updated.image,
  });
}
