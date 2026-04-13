import { db } from "@/db/example-db-interaction";
import { reviewMajors, reviews } from "@/db/schema/schema";
import { user } from "@/db/schema/auth-schema";
import { auth } from "@/lib/auth";
import { jsonSafe } from "@/lib/utils/json-safe";
import { NextResponse } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm";

function isValidIntegerInRange(value: number, min: number, max: number) {
  return Number.isInteger(value) && value >= min && value <= max;
}

function normalizeGpa(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (!str) return null;
  const num = Number(str);
  if (!Number.isFinite(num) || num < 0 || num > 5) return null;
  return num.toFixed(2);
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
        rating: sql<number>`round((${reviews.difficulty} + ${reviews.contentScore} + ${reviews.professorsScore} + ${reviews.advisorsScore}) / 4, 2)`,
        difficulty: reviews.difficulty,
        content: reviews.contentScore,
        professors: reviews.professorsScore,
        advisors: reviews.advisorsScore,
        outcomes: reviews.outcomesScore,
        regret_percentage: reviews.regretPercentage,
        reviewer_gpa: reviews.reviewerGpa,
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
    const difficulty = Number(body?.difficulty);
    const content = Number(body?.content);
    const professors = Number(body?.professors);
    const advisors = Number(body?.advisors);
    const outcomes = Number(body?.outcomes);
    const regretPercentage = Number(body?.regret_percentage);
    const comment = String(body?.comment ?? "").trim();
    const majorStatus = body?.major_status ? String(body.major_status) : null;
    const providedReviewerGpa = normalizeGpa(body?.reviewer_gpa);

    if (
      !isValidIntegerInRange(difficulty, 1, 5) ||
      !isValidIntegerInRange(content, 1, 5) ||
      !isValidIntegerInRange(professors, 1, 5) ||
      !isValidIntegerInRange(advisors, 1, 5)
    ) {
      return NextResponse.json(
        { message: "Difficulty, content, professors, and advisors must be integers between 1 and 5" },
        { status: 400 }
      );
    }

    if (!isValidIntegerInRange(outcomes, 0, 10)) {
      return NextResponse.json(
        { message: "Outcomes must be an integer between 0 and 10" },
        { status: 400 }
      );
    }

    if (!isValidIntegerInRange(regretPercentage, 0, 100)) {
      return NextResponse.json(
        { message: "Regret percentage must be an integer between 0 and 100" },
        { status: 400 }
      );
    }

    if (!comment) {
      return NextResponse.json({ message: "Comment is required" }, { status: 400 });
    }

    const [currentUser] = await db
      .select({ gpa: user.gpa })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    const reviewerGpa = normalizeGpa(currentUser?.gpa) || providedReviewerGpa;

    if (!reviewerGpa) {
      return NextResponse.json(
        { message: "Please add your GPA to your profile (or this review) before submitting." },
        { status: 400 }
      );
    }

    if (!normalizeGpa(reviewerGpa)) {
      return NextResponse.json(
        { message: "Reviewer GPA must be a number between 0.00 and 5.00" },
        { status: 400 }
      );
    }

    const compositeRating = Math.round((difficulty + content + professors + advisors) / 4);

    const created = await db.transaction(async (tx) => {
      if (!currentUser?.gpa && providedReviewerGpa) {
        await tx.update(user).set({ gpa: providedReviewerGpa }).where(eq(user.id, userId));
      }

      const [insertReview] = await tx.insert(reviews).values({
        userId,
        rating: compositeRating,
        difficulty,
        contentScore: content,
        professorsScore: professors,
        advisorsScore: advisors,
        outcomesScore: outcomes,
        regretPercentage,
        reviewerGpa,
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
          rating: sql<number>`round((${reviews.difficulty} + ${reviews.contentScore} + ${reviews.professorsScore} + ${reviews.advisorsScore}) / 4, 2)`,
          difficulty: reviews.difficulty,
          content: reviews.contentScore,
          professors: reviews.professorsScore,
          advisors: reviews.advisorsScore,
          outcomes: reviews.outcomesScore,
          regret_percentage: reviews.regretPercentage,
          reviewer_gpa: reviews.reviewerGpa,
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
