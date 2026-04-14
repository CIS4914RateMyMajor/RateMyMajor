"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type University = {
  id: number;
  name: string;
  location: string | null;
};

type Major = {
  id: number;
  name: string;
  type: string | null;
  departmentId: number;
  departmentName: string;
  universityId: number;
  universityName: string;
};

type Department = {
  id: number;
  name: string;
  universityId: number;
  universityName: string;
};

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const [uniRes, majorRes] = await Promise.all([
          fetch("/api/universities"),
          fetch("/api/majors"),
        ]);

        if (!uniRes.ok || !majorRes.ok) {
          throw new Error("Failed to load search data");
        }

        const [uniData, majorData] = await Promise.all([uniRes.json(), majorRes.json()]);
        setUniversities(uniData as University[]);
        setMajors(majorData as Major[]);
      } catch (err: any) {
        setError(err?.message || "Failed to load search data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const departments = useMemo(() => {
    const map = new Map<number, Department>();
    for (const major of majors) {
      if (!map.has(major.departmentId)) {
        map.set(major.departmentId, {
          id: major.departmentId,
          name: major.departmentName,
          universityId: major.universityId,
          universityName: major.universityName,
        });
      }
    }
    return Array.from(map.values());
  }, [majors]);

  const normalized = query.trim().toLowerCase();

  const filteredUniversities = useMemo(() => {
    if (!normalized) return [];
    return universities
      .filter(
        (u) =>
          u.name.toLowerCase().includes(normalized) ||
          (u.location || "").toLowerCase().includes(normalized)
      )
      .slice(0, 5);
  }, [universities, normalized]);

  const filteredDepartments = useMemo(() => {
    if (!normalized) return [];
    return departments
      .filter(
        (d) =>
          d.name.toLowerCase().includes(normalized) ||
          d.universityName.toLowerCase().includes(normalized)
      )
      .slice(0, 5);
  }, [departments, normalized]);

  const filteredMajors = useMemo(() => {
    if (!normalized) return [];
    return majors
      .filter(
        (m) =>
          m.name.toLowerCase().includes(normalized) ||
          m.departmentName.toLowerCase().includes(normalized) ||
          m.universityName.toLowerCase().includes(normalized)
      )
      .slice(0, 5);
  }, [majors, normalized]);

  const hasResults =
    filteredUniversities.length > 0 || filteredDepartments.length > 0 || filteredMajors.length > 0;

  return (
    <section className="px-6 md:px-12 py-8">
      <div className="max-w-5xl mx-auto border-6 bg-[#B1A088] border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-6">
          <div className="inline-block bg-yellow-400 text-black text-s-bold font-black px-3 py-1 uppercase tracking-widest border-2 border-black mb-3">
            Search Everything
          </div>
          <p className="text-gray-600 font-bold uppercase tracking-wide text-sm">
            Universities · Departments · Majors
          </p>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search schools, departments, or majors..."
          className="w-full p-5 text-lg border-4 bg-white border-black font-bold uppercase tracking-wide focus:bg-black focus:text-white transition-all outline-none"
        />

        {isLoading ? (
          <div className="text-center py-8">
            <span className="text-lg font-black animate-pulse uppercase">Loading search data...</span>
          </div>
        ) : error ? (
          <div className="mt-6 bg-red-50 border-4 border-red-500 p-4 text-red-700 font-bold">ERROR: {error}</div>
        ) : normalized ? (
          <div className="mt-6 space-y-6">
            {!hasResults && (
              <div className="text-center py-8 border-4 border-dashed border-gray-300">
                <p className="text-lg font-black text-gray-400 uppercase tracking-widest">
                  No matches found
                </p>
              </div>
            )}

            {filteredUniversities.length > 0 && (
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-3">Universities</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredUniversities.map((u) => (
                    <li key={`uni-${u.id}`}>
                      <Link
                        href={`/school/${u.id}`}
                        className="block border-4 border-black p-4 font-black hover:bg-black hover:text-white transition-colors"
                      >
                        <p className="uppercase text-base">{u.name}</p>
                        <p className="text-xs opacity-70 mt-1">{u.location || "Location TBD"}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {filteredDepartments.length > 0 && (
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-3">Departments</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredDepartments.map((d) => (
                    <li key={`dept-${d.id}`}>
                      <Link
                        href={`/department/${d.id}`}
                        className="block border-4 border-black p-4 font-black hover:bg-black hover:text-white transition-colors"
                      >
                        <p className="uppercase text-base">{d.name}</p>
                        <p className="text-xs opacity-70 mt-1">{d.universityName}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {filteredMajors.length > 0 && (
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-3">Majors</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMajors.map((m) => (
                    <li key={`major-${m.id}`}>
                      <Link
                        href={`/major/${m.id}`}
                        className="block border-4 border-black p-4 font-black hover:bg-black hover:text-white transition-colors"
                      >
                        <p className="uppercase text-base">{m.name}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {m.departmentName} · {m.universityName}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-6 text-center text-gray-500 font-bold uppercase tracking-wide text-sm">
            Start typing to search all categories.
          </p>
        )}
      </div>
    </section>
  );
}
