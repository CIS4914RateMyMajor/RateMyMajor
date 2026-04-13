import Navbar from "./nav-bar";
import Link from "next/link";

export default async function Home() {
  return (
      <div className="min-h-screen bg-white text-black font-sans">

        {/* Navbar */}
        <Navbar/>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-16 px-8 relative">
          {/* Sketch icons around the title — use your own SVGs or img tags */}
          <div className="flex items-center gap-6">
            {/* Left sketch icon placeholder */}
            <div className="w-60 h-60 opacity-60">
              {/* Replace with your sketch SVG, e.g. graduation cap */}
              <img src="/art_assets/grad cap art.png" alt="" className="w-full h-full object-contain" />
            </div>

            <h1 className="text-5xl font-black tracking-tight text-center leading-none uppercase">
              RATE MY MAJOR
            </h1>

            {/* Right sketch icon placeholder */}
            <div className="w-40 h-40 opacity-60">
              <img src="/art_assets/brain art.png" alt="" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Bottom sketch icons row */}
          <div className="flex gap-8 mt-6 opacity-60">
            <img src="/art_assets/graph art.png" alt="" className="w-40 h-40 object-contain" />
            <img src="/art_assets/grad cap art.png" alt="" className="w-16 h-16 object-contain" />
          </div>
        </section>

        {/* Product value + quick actions */}
        <section className="px-6 md:px-12 py-10 border-t-6 border-black">
          <div className="max-w-5xl mx-auto border-6 border-black p-8 md:p-10 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="inline-block bg-yellow-400 text-black text-xs font-black px-3 py-1 uppercase tracking-widest border-2 border-black mb-4">
              Why RateMyMajor
            </div>

            <p className="text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
              RateMyMajor helps students compare majors across schools using real
              student reviews, difficulty ratings, and outcomes. Browse verified
              institutions, explore departments, and share your own experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto">
              <Link
                href="/school"
                className="px-6 py-4 border-4 border-black font-black uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                Browse Schools
              </Link>
              <Link
                href="/major"
                className="px-6 py-4 border-4 border-black font-black uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                Explore Majors
              </Link>
            </div>
          </div>
        </section>

      </div>
  );
}