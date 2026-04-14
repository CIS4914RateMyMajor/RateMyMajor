import { db } from "@/db/example-db-interaction";
import { reviewMajors, reviews } from "@/db/schema/schema";
import { user } from "@/db/schema/auth-schema";
import { auth } from "@/lib/auth";
import { jsonSafe } from "@/lib/utils/json-safe";
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

function isValidRating(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

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
        review_id: reviews.id,
        major_id: reviewMajors.majorId,
        user_id: reviews.userId,
        username: user.name,
        rating: reviews.rating,
        difficulty: reviews.difficulty,
        comment: reviews.comment,
        major_status: reviews.majorStatus,
        review_status: reviews.reviewStatus,
        created_at: reviews.creationDate,
        updated_at: reviews.lastUpdated,
      })
      .from(reviewMajors)
      .innerJoin(reviews, eq(reviewMajors.reviewId, reviews.id))
      .innerJoin(user, eq(reviews.userId, user.id))
      .where(eq(reviewMajors.majorId, majorId))
      .orderBy(desc(reviews.creationDate));

    return NextResponse.json(jsonSafe(rows));
  } catch (error) {
    console.error("Failed to fetch major reviews:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const majorId = parseInt(id, 10);

    if (isNaN(majorId)) {
      return NextResponse.json({ message: "Invalid Major ID" }, { status: 400 });
    }

    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const rating = Number(body?.rating);
    const difficulty = Number(body?.difficulty);
    const comment = String(body?.comment ?? "").trim();
    const majorStatus = body?.major_status ? String(body.major_status) : null;

    if (!isValidRating(rating) || !isValidRating(difficulty)) {
      return NextResponse.json(
        { message: "Rating and difficulty must be integers between 1 and 5" },
        { status: 400 }
      );
    }

    if (!comment) {
      return NextResponse.json({ message: "Comment is required" }, { status: 400 });
    }

    const created = await db.transaction(async (tx) => {
      const [insertReview] = await tx.insert(reviews).values({
        userId,
        rating,
        difficulty,
        comment,
        majorStatus,
      });

      const reviewId = insertReview.insertId;

      await tx.insert(reviewMajors).values({
        majorId,
        reviewId,
      });

      const [saved] = await tx
        .select({
          review_id: reviews.id,
          major_id: reviewMajors.majorId,
          user_id: reviews.userId,
          username: user.name,
          rating: reviews.rating,
          difficulty: reviews.difficulty,
          comment: reviews.comment,
          major_status: reviews.majorStatus,
          review_status: reviews.reviewStatus,
          created_at: reviews.creationDate,
          updated_at: reviews.lastUpdated,
        })
        .from(reviews)
        .innerJoin(reviewMajors, and(eq(reviewMajors.reviewId, reviews.id), eq(reviewMajors.majorId, majorId)))
        .innerJoin(user, eq(reviews.userId, user.id))
        .where(eq(reviews.id, reviewId))
        .limit(1);

      return saved;
    });

    return NextResponse.json(jsonSafe(created), { status: 201 });
  } catch (error) {
    console.error("Failed to create major review:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
