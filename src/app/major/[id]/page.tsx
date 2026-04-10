"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/nav-bar";
import { reviewsAPI } from "@/lib/reviews";
import { authClient } from "@/lib/auth-client";

type MajorDetail = {
  id: number;
  name: string;
  type: string | null;
  dept_id: number;
  department_name: string;
  university_id: number;
  university_name: string;
  review_count: number;
  avg_rating: number;
  avg_difficulty: number;
};

type MajorReview = {
  review_id: number;
  major_id: number;
  user_id: string;
  username: string;
  rating: number;
  difficulty: number;
  comment: string;
  major_status: string | null;
  review_status: string | null;
  created_at: string | null;
  updated_at: string;
};

export default function MajorDetailPage() {
  const params = useParams<{ id: string }>();
  const majorId = Number(params?.id);

  const { data: session } = authClient.useSession();

  const [major, setMajor] = useState<MajorDetail | null>(null);
  const [reviews, setReviews] = useState<MajorReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(5);
  const [difficulty, setDifficulty] = useState(3);
  const [comment, setComment] = useState("");
  const [majorStatus, setMajorStatus] = useState("Current Student");

  const loadPage = useCallback(async () => {
    if (!majorId || Number.isNaN(majorId)) {
      setError("Invalid major id");
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      const [majorRes, reviewsRes] = await Promise.all([
        fetch(`/api/majors/${majorId}`, { credentials: "include" }),
        reviewsAPI.getReviews(majorId),
      ]);

      if (!majorRes.ok) {
        const err = await majorRes.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to load major");
      }

      const majorData = (await majorRes.json()) as MajorDetail;
      setMajor(majorData);
      setReviews(reviewsRes as MajorReview[]);
    } catch (err: any) {
      setError(err?.message || "Failed to load major and reviews");
    } finally {
      setIsLoading(false);
    }
  }, [majorId]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const canSubmit = useMemo(() => comment.trim().length > 0, [comment]);

  async function onSubmitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await reviewsAPI.submitReview(majorId, {
        rating,
        difficulty,
        comment: comment.trim(),
        major_status: majorStatus,
      });

      setComment("");
      await loadPage();
    } catch (err: any) {
      setError(err?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {isLoading ? (
          <p className="text-lg font-bold">Loading major page...</p>
        ) : error ? (
          <div className="border-2 border-red-500 bg-red-50 p-4 text-red-700">{error}</div>
        ) : !major ? (
          <div className="border-2 border-black p-4">Major not found.</div>
        ) : (
          <>
            <section className="border-2 border-black p-4 space-y-2">
              <h1 className="text-3xl font-bold">{major.name}</h1>
              <p className="text-sm">Type: {major.type || "N/A"}</p>
              <p className="text-sm">Department: {major.department_name}</p>
              <p className="text-sm">University: {major.university_name}</p>
              <div className="pt-2 text-sm space-y-1">
                <p>Reviews: {major.review_count}</p>
                <p>Average Rating: {major.avg_rating}</p>
                <p>Average Difficulty: {major.avg_difficulty}</p>
              </div>
            </section>

            <section className="border-2 border-black p-4">
              <h2 className="text-xl font-semibold mb-4">Write a review (placeholder UI)</h2>

              {!session ? (
                <p className="text-sm">Sign in to submit a review.</p>
              ) : (
                <form onSubmit={onSubmitReview} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="flex flex-col gap-1 text-sm">
                      Rating (1-5)
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="border border-black p-2"
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                      Difficulty (1-5)
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value))}
                        className="border border-black p-2"
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                      Major status
                      <select
                        value={majorStatus}
                        onChange={(e) => setMajorStatus(e.target.value)}
                        className="border border-black p-2"
                      >
                        <option>Current Student</option>
                        <option>Graduated</option>
                        <option>Switched Out</option>
                      </select>
                    </label>
                  </div>

                  <label className="flex flex-col gap-1 text-sm">
                    Comment
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="border border-black p-2"
                      placeholder="Describe your experience in this major"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="border border-black px-4 py-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit review"}
                  </button>
                </form>
              )}
            </section>

            <section className="border-2 border-black p-4">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>

              {reviews.length === 0 ? (
                <p className="text-sm">No reviews yet.</p>
              ) : (
                <ul className="space-y-3">
                  {reviews.map((review) => (
                    <li key={review.review_id} className="border border-gray-300 p-3 space-y-1">
                      <p className="text-sm font-semibold">{review.username}</p>
                      <p className="text-sm">
                        Rating: {review.rating} / 5 · Difficulty: {review.difficulty} / 5
                      </p>
                      {review.major_status && <p className="text-xs">Status: {review.major_status}</p>}
                      <p className="text-sm">{review.comment}</p>
                      <p className="text-xs text-gray-500">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
