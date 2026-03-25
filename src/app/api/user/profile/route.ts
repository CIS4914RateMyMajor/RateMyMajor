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
    // TODO: add major/college/gpa fields once DB schema supports them
  });
}

export async function PATCH(req: Request) {
  const userId = await getSessionUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: { username?: string; major?: string; college?: string; gpa?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!body.username && !body.major && !body.college && !body.gpa) {
    return NextResponse.json({ message: "No fields to update" }, { status: 400 });
  }

  const updatePayload: Partial<{ name: string }> = {};
  if (body.username) updatePayload.name = body.username;
  // major/college/gpa are not in DB yet

  if (Object.keys(updatePayload).length > 0) {
    await db.update(user).set(updatePayload).where(eq(user.id, userId));
  }

  const rows = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  const updated = rows[0];

  if (!updated) {
    return NextResponse.json({ message: "User not found after update" }, { status: 404 });
  }

  return NextResponse.json({
    username: updated.name,
    email: updated.email,
  });
}
