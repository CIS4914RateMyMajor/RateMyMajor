"use client";

import { useEffect, useState } from "react";
import Navbar from "../nav-bar";
import { useRouter } from "next/navigation";

interface UniversityData {
  id: number;
  name: string;
  location: string;
  departmentCount: number;
  majorCount: number;
}

export default function SchoolsPage() {
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<UniversityData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const response = await fetch("/api/universities");
        if (!response.ok) throw new Error("Failed to fetch universities");
        const data = await response.json();
        setUniversities(data);
        setFilteredUniversities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUniversities();
  }, []);

  useEffect(() => {
    const filtered = universities.filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.location && u.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUniversities(filtered);
  }, [searchTerm, universities]);

  const handleUniversityClick = (uni: UniversityData) => {
    router.push(`/school/${uni.id}`);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-8">
        <header className="mb-12 border-b-6 border-black pb-8">
          <h1 className="text-5xl font-black tracking-tight uppercase leading-none mb-4">
            Verified Schools
          </h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Browse through our verified institutions. Click a school to explore its specific departments and majors.
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search by university name or location..."
            className="w-full p-6 text-xl border-4 border-black font-bold uppercase tracking-widest focus:bg-black focus:text-white transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Main Content Area */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-2xl font-black animate-pulse uppercase">LOADING SCHOOLS...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-4 border-red-500 p-8 text-red-700 font-bold">
            ERROR: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUniversities.map((uni) => (
              <div 
                key={uni.id} 
                onClick={() => handleUniversityClick(uni)}
                className="border-6 border-black p-6 hover:translate-x-2 hover:-translate-y-2 transition-transform bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 uppercase tracking-widest border-2 border-black">
                    INSTITUTION
                  </span>
                  <span className="text-gray-400 font-bold text-xs">#{uni.id}</span>
                </div>
                
                <h2 className="text-2xl font-black uppercase mb-2 leading-tight min-h-[4rem]">
                  {uni.name}
                </h2>
                
                <div className="space-y-4">
                  <p className="font-bold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black rounded-full bg-red-500" />
                    {uni.location || "Location TBD"}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="border-2 border-black p-2 text-center">
                        <p className="text-xl font-black">{uni.departmentCount}</p>
                        <p className="text-[10px] font-black uppercase">Depts</p>
                    </div>
                    <div className="border-2 border-black p-2 text-center">
                        <p className="text-xl font-black">{uni.majorCount}</p>
                        <p className="text-[10px] font-black uppercase">Majors</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t-4 border-black flex justify-between items-center">
                  <button className="font-black text-sm uppercase underline hover:no-underline">
                    Explore Majors 
                  </button>
                  <div className="bg-black text-white p-1 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
                     </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredUniversities.length === 0 && (
          <div className="text-center py-20 border-6 border-dashed border-gray-300">
            <p className="text-2xl font-black text-gray-400 uppercase tracking-widest">
              No schools found matching "{searchTerm}"
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
