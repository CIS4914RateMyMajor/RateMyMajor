"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/nav-bar";

type DepartmentMajor = {
  id: number;
  name: string;
  type: string | null;
  department_name: string;
  avg_rating: number;
};

function getRatingColorClass(rating: number) {
  if (rating >= 4.5) return "bg-green-500";
  if (rating >= 3.5) return "bg-lime-500";
  if (rating >= 2.5) return "bg-yellow-400";
  if (rating >= 1.5) return "bg-orange-400";
  if (rating > 0) return "bg-red-500";
  return "bg-gray-200";
}

export default function DepartmentMajorsPage() {
  const params = useParams<{ id: string }>();
  const departmentId = Number(params?.id);

  const [majors, setMajors] = useState<DepartmentMajor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMajors() {
      if (!departmentId || Number.isNaN(departmentId)) {
        setError("Invalid department id");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);

        const res = await fetch(`/api/departments/${departmentId}/majors`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to load department majors");
        }

        const data = (await res.json()) as DepartmentMajor[];
        setMajors(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load department majors");
      } finally {
        setLoading(false);
      }
    }

    loadMajors();
  }, [departmentId]);

  return (
      <div className="relative min-h-screen text-black">
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/art_assets/bkgd.png')", 
            backgroundSize: '400px',
            backgroundRepeat: 'repeat',
            opacity: 0.15,
            zIndex: -1, 
          }}
        />
    <div className="min-h-screen bg-transparent text-black font-sans">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-2xl font-black animate-pulse uppercase">LOADING MAJORS...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-4 border-red-500 p-8 text-red-700 font-bold">
            ERROR: {error}
          </div>
        ) : (
          <section>
            <header className="mb-12 border-b-6 border-black pb-8">
              <h1 className="text-5xl font-black tracking-tight uppercase leading-none mb-4">
                {majors[0]?.department_name || "Department"}
              </h1>
              <p className="text-gray-600 max-w-2xl text-lg">
                Browse all majors in this department and jump directly to student reviews.
              </p>
            </header>

            {majors.length === 0 ? (
              <div className="text-center py-20 border-6 border-dashed border-gray-300">
                <p className="text-2xl font-black text-gray-400 uppercase tracking-widest">
                  No majors found for this department
                </p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {majors.map((major) => (
                  <li key={major.id}>
                    <Link
                      href={`/major/${major.id}`}
                      className="group block border-6 border-black p-6 hover:translate-x-2 hover:-translate-y-2 transition-transform bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-black text-white text-xs font-black px-3 py-1 uppercase tracking-widest">
                          {major.type || "MAJOR"}
                        </span>
                        <span className="text-gray-400 font-bold text-xs">#{major.id}</span>
                      </div>

                      <h2 className="text-2xl font-black uppercase mb-4 leading-tight min-h-[4rem]">
                        {major.name}
                      </h2>

                      <div className="pt-4 border-t-4 border-black flex justify-between items-center">
                        <span className="font-black text-sm uppercase underline group-hover:no-underline">
                          View Reviews
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => {
                              const filledCount = Math.max(0, Math.min(5, Math.round(major.avg_rating || 0)));
                              const isFilled = i <= filledCount;
                              return (
                                <div
                                  key={i}
                                  className={`w-3 h-3 border-2 border-black rounded-full ${
                                    isFilled ? getRatingColorClass(major.avg_rating || 0) : "bg-white"
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <div className="bg-black text-white p-1 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
      </div>
    </div>
  );
}
