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
};

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
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {loading ? (
          <p className="font-bold">Loading majors...</p>
        ) : error ? (
          <div className="border border-red-500 bg-red-50 p-4 text-red-700">{error}</div>
        ) : (
          <section className="border border-black p-4">
            <h1 className="text-2xl font-bold mb-4">
              {majors[0]?.department_name || "Department"} Majors (placeholder UI)
            </h1>

            {majors.length === 0 ? (
              <p className="text-sm">No majors found for this department.</p>
            ) : (
              <ul className="space-y-2">
                {majors.map((major) => (
                  <li key={major.id} className="border border-gray-300 p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{major.name}</p>
                      <p className="text-xs text-gray-500">Type: {major.type || "N/A"}</p>
                    </div>
                    <Link href={`/major/${major.id}`} className="underline text-sm">
                      View ratings
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
