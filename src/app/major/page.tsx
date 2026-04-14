"use client";

import { useEffect, useState, Suspense } from "react";
import Navbar from "../nav-bar";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface MajorData {
  id: number;
  name: string;
  type: string;
  departmentName: string;
  universityName: string;
}

function MajorsContent() {
  const searchParams = useSearchParams();
  const universityId = searchParams.get("universityId");
  
  const [majors, setMajors] = useState<MajorData[]>([]);
  const [filteredMajors, setFilteredMajors] = useState<MajorData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMajors() {
      try {
        const url = universityId 
          ? `/api/majors?universityId=${universityId}` 
          : "/api/majors";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch majors");
        const data = await response.json();
        setMajors(data);
        setFilteredMajors(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMajors();
  }, [universityId]);

  useEffect(() => {
    const filtered = majors.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMajors(filtered);
  }, [searchTerm, majors]);

  const schoolName = majors.length > 0 && universityId ? majors[0].universityName : null;

  return (
    
    <main className="max-w-6xl mx-auto text-center p-4 md:p-8">
      <header className="mb-8 md:mb-12 border-b-6 border-black pb-6 md:pb-8">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none mb-3 md:mb-4">
          {schoolName ? `Majors at ${schoolName}` : "Explore Majors"}
        </h1>
        <p className="text-black-600 font-bold max-w-2xl mx-auto text-base mx-auto md:text-lg">
          {schoolName 
            ? `Viewing all ${majors.length} academic programs available at this institution.` 
            : "Search through hundreds of programs from top universities. See what real students have to say about their academic journey."}
        </p>
      </header>

      {/* Search Bar */}
      <div className="mb-8 md:mb-12">
        <input
          type="text"
          placeholder="Search majors, departments, or keywords..."
          className="w-full p-4 md:p-6 text-base md:text-xl border-4 border-black font-bold uppercase tracking-wide md:tracking-widest focus:bg-black focus:text-white transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="text-2xl font-black animate-pulse">LOADING MAJORS...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-4 border-red-500 p-8 text-red-700 font-bold">
          ERROR: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {filteredMajors.map((major) => (
            <Link
              key={major.id}
              href={`/major/${major.id}`}
              className="group block border-6 border-black p-6 hover:translate-x-2 hover:-translate-y-2 transition-transform bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-black text-white text-xs font-black px-3 py-1 uppercase tracking-widest border-2 border-black">
                  {major.type || "MAJOR"}
                </span>
                <span className="text-gray-400 font-bold text-xs">#{major.id}</span>
              </div>
              
              <h2 className="text-xl md:text-2xl font-black uppercase mb-2 leading-tight">
                {major.name}
              </h2>
              
              <div className="space-y-1">
                <p className="font-bold text-sm uppercase tracking-wider text-gray-500">
                  {major.departmentName}
                </p>
                {!schoolName && (
                  <p className="font-bold text-xs text-gray-400">
                    {major.universityName}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t-4 border-black flex justify-between items-center">
                <span className="font-black text-sm uppercase underline group-hover:no-underline">
                  View Reviews
                </span>
                <div className="bg-black text-white p-1 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && filteredMajors.length === 0 && (
        <div className="text-center py-20 border-6 border-dashed border-gray-300">
          <p className="text-2xl font-black text-gray-400 uppercase tracking-widest">
            No results found for "{searchTerm}"
          </p>
        </div>
      )}
    </main>
  );
}

export default function MajorsPage() {
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
      <Suspense fallback={<div className="flex justify-center items-center h-screen font-black text-2xl uppercase">Loading...</div>}>
        <MajorsContent />
      </Suspense>
    </div>
    </div>
  );
}
