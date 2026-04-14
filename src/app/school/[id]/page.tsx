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
      <main className="max-w-6xl mx-auto p-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-2xl font-black animate-pulse uppercase">LOADING SCHOOL...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-4 border-red-500 p-8 text-red-700 font-bold">
            ERROR: {error}
          </div>
        ) : !university ? (
          <div className="text-center py-20 border-6 border-dashed border-gray-300">
            <p className="text-2xl font-black text-gray-400 uppercase tracking-widest">
              School not found
            </p>
          </div>
        ) : (
          <>
            <header className="mb-12 border-b-6 border-black pb-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-5xl font-black tracking-tight uppercase leading-none mb-4">
                    {university.name}
                  </h1>
                  <p className="text-gray-600 max-w-2xl text-lg">
                    {university.location || "Location unavailable"}
                  </p>
                </div>
                <div className="border-4 border-black px-4 py-3 text-center min-w-[120px]">
                  <p className="text-3xl font-black">{departments.length}</p>
                  <p className="text-xs font-black uppercase tracking-widest">Departments</p>
                </div>
              </div>
            </header>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Departments</h2>
              {departments.length === 0 ? (
                <div className="text-center py-20 border-6 border-dashed border-gray-300">
                  <p className="text-2xl font-black text-gray-400 uppercase tracking-widest">
                    No departments found
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {departments.map((dept) => (
                    <li key={dept.id}>
                      <Link
                        href={`/department/${dept.id}`}
                        className="group block border-6 border-black p-6 hover:translate-x-2 hover:-translate-y-2 transition-transform bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 uppercase tracking-widest border-2 border-black">
                            DEPARTMENT
                          </span>
                          <span className="text-gray-400 font-bold text-xs">#{dept.id}</span>
                        </div>

                        <h3 className="text-2xl font-black uppercase mb-4 leading-tight min-h-[4rem]">
                          {dept.name}
                        </h3>

                        <div className="border-2 border-black p-3 text-center mb-6">
                          <p className="text-2xl font-black">{dept.major_count}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest">Majors</p>
                        </div>

                        <div className="pt-4 border-t-4 border-black flex justify-between items-center">
                          <span className="font-black text-sm uppercase underline group-hover:no-underline">
                            Explore Majors
                          </span>
                          <div className="bg-black text-white p-1 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
                            </svg>
                          </div>
                        </div>
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
