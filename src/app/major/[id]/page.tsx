"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const majorId = Number(params?.id);

  const { data: session, isPending: isSessionPending, refetch: refetchSession } = authClient.useSession();

  useEffect(() => {
    refetchSession();
  }, [pathname, refetchSession]);

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

      <main className="max-w-6xl mx-auto p-8 space-y-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-2xl font-black animate-pulse uppercase">LOADING MAJOR...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-4 border-red-500 p-8 text-red-700 font-bold">
            ERROR: {error}
          </div>
        ) : !major ? (
          <div className="text-center py-20 border-6 border-dashed border-gray-300">
            <p className="text-2xl font-black text-gray-400 uppercase tracking-widest">
              Major not found
            </p>
          </div>
        ) : (
          <>
            <section className="border-6 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-start gap-3 mb-4">
                <span className="bg-black text-white text-xs font-black px-3 py-1 uppercase tracking-widest">
                  {major.type || "MAJOR"}
                </span>
                <span className="text-gray-400 font-bold text-xs">#{major.id}</span>
              </div>

              <h1 className="text-4xl font-black uppercase leading-tight mb-3">{major.name}</h1>
              <p className="font-bold text-sm uppercase tracking-wider text-gray-500">{major.department_name}</p>
              <p className="font-bold text-xs text-gray-400 mb-6">{major.university_name}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border-2 border-black p-3 text-center">
                  <p className="text-2xl font-black">{major.review_count}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest">Reviews</p>
                </div>
                <div className="border-2 border-black p-3 text-center">
                  <p className="text-2xl font-black">{major.avg_rating}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest">Avg Rating</p>
                </div>
                <div className="border-2 border-black p-3 text-center">
                  <p className="text-2xl font-black">{major.avg_difficulty}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest">Avg Difficulty</p>
                </div>
              </div>
            </section>

            <section className="border-6 border-black p-6 bg-white">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Write a review</h2>

              {isSessionPending ? (
                 <div className="border-2 border-black p-4 text-sm font-bold uppercase tracking-wide animate-pulse">
                  CHECKING SESSION...
                </div>
              ) : !session ? (
                <div className="border-2 border-black p-4 text-sm font-bold uppercase tracking-wide">
                  Sign in to submit a review.
                </div>
              ) : (
                <form onSubmit={onSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex flex-col gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                      Rating (1-5)
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full p-3 border-2 border-black font-bold text-black outline-none focus:bg-black focus:text-white transition-colors"
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                      Difficulty (1-5)
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value))}
                        className="w-full p-3 border-2 border-black font-bold text-black outline-none focus:bg-black focus:text-white transition-colors"
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                      Major status
                      <select
                        value={majorStatus}
                        onChange={(e) => setMajorStatus(e.target.value)}
                        className="w-full p-3 border-2 border-black font-bold text-black outline-none focus:bg-black focus:text-white transition-colors"
                      >
                        <option>Current Student</option>
                        <option>Graduated</option>
                        <option>Switched Out</option>
                      </select>
                    </label>
                  </div>

                  <label className="flex flex-col gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                    Comment
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full p-4 border-2 border-black font-bold text-black outline-none focus:bg-black focus:text-white transition-colors"
                      placeholder="Describe your experience in this major"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="px-6 py-3 border-4 border-black font-black uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit review"}
                  </button>
                </form>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Reviews</h2>

              {reviews.length === 0 ? (
                <div className="text-center py-16 border-6 border-dashed border-gray-300">
                  <p className="text-xl font-black text-gray-400 uppercase tracking-widest">
                    No reviews yet
                  </p>
                </div>
              ) : (
                <ul className="space-y-6">
                  {reviews.map((review) => (
                    <li
                      key={review.review_id}
                      className="border-6 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-black uppercase tracking-wider">{review.username}</p>
                        <p className="text-xs text-gray-500 font-bold">
                          {review.created_at
                            ? new Date(review.created_at).toLocaleDateString()
                            : "Date unavailable"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="border-2 border-black p-2 text-center">
                          <p className="text-xl font-black">{review.rating}/5</p>
                          <p className="text-[10px] font-black uppercase tracking-widest">Rating</p>
                        </div>
                        <div className="border-2 border-black p-2 text-center">
                          <p className="text-xl font-black">{review.difficulty}/5</p>
                          <p className="text-[10px] font-black uppercase tracking-widest">Difficulty</p>
                        </div>
                      </div>

                      {review.major_status && (
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                          Status: {review.major_status}
                        </p>
                      )}

                      <p className="text-sm leading-relaxed">{review.comment}</p>
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
