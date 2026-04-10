"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/nav-bar";

type University = {
  id: number;
  name: string;
  location: string | null;
};

type Department = {
  id: number;
  name: string;
  university_id: number;
  major_count: number;
};

export default function SchoolDetailPage() {
  const params = useParams<{ id: string }>();
  const universityId = Number(params?.id);

  const [university, setUniversity] = useState<University | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!universityId || Number.isNaN(universityId)) {
        setError("Invalid school id");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);

        const [uniRes, deptRes] = await Promise.all([
          fetch("/api/universities", { credentials: "include" }),
          fetch(`/api/universities/${universityId}/departments`, { credentials: "include" }),
        ]);

        if (!uniRes.ok || !deptRes.ok) {
          throw new Error("Failed to load school data");
        }

        const universities = (await uniRes.json()) as University[];
        const deptData = (await deptRes.json()) as Department[];

        setUniversity(universities.find((u) => u.id === universityId) ?? null);
        setDepartments(deptData);
      } catch (err: any) {
        setError(err?.message || "Failed to load school data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [universityId]);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {loading ? (
          <p className="font-bold">Loading school...</p>
        ) : error ? (
          <div className="border border-red-500 bg-red-50 p-4 text-red-700">{error}</div>
        ) : !university ? (
          <div className="border border-black p-4">School not found.</div>
        ) : (
          <>
            <section className="border border-black p-4">
              <h1 className="text-2xl font-bold">{university.name}</h1>
              <p className="text-sm">{university.location || "Location unavailable"}</p>
            </section>

            <section className="border border-black p-4">
              <h2 className="text-xl font-semibold mb-3">Departments (placeholder UI)</h2>
              {departments.length === 0 ? (
                <p className="text-sm">No departments found.</p>
              ) : (
                <ul className="space-y-2">
                  {departments.map((dept) => (
                    <li key={dept.id} className="border border-gray-300 p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-xs text-gray-500">Majors: {dept.major_count}</p>
                      </div>
                      <Link href={`/department/${dept.id}`} className="underline text-sm">
                        View majors
                      </Link>
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
