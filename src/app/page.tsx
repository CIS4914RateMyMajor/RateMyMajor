import Navbar from "./nav-bar";
import Link from "next/link";
import HomeSearch from "./home-search";

export default async function Home() {
  return (
      <div className="min-h-screen bg-white text-black">

        {/* Navbar */}
        <Navbar/>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-10 md:py-16 px-4 md:px-8 relative">
          {/* Sketch icons around the title — use your own SVGs or img tags */}
          <div className="flex items-center justify-center gap-3 md:gap-6 w-full">
            {/* Left sketch icon placeholder */}
            <div className="hidden sm:block w-24 h-24 md:w-60 md:h-60 opacity-60">
              {/* Replace with your sketch SVG, e.g. graduation cap */}
              <img src="/art_assets/grad cap art.png" alt="" className="w-full h-full object-contain" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-Lemon Smash tracking-tight text-center leading-none uppercase">
              RATE MY MAJOR
            </h1>

            {/* Right sketch icon placeholder */}
            <div className="hidden sm:block w-20 h-20 md:w-40 md:h-40 opacity-60">
              <img src="/art_assets/brain art.png" alt="" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Bottom sketch icons row */}
          <div className="flex gap-4 md:gap-8 mt-4 md:mt-6 opacity-60">
            <img src="/art_assets/graph art.png" alt="" className="w-20 h-20 md:w-40 md:h-40 object-contain" />
            <img src="/art_assets/grad cap art.png" alt="" className="w-10 h-10 md:w-16 md:h-16 object-contain" />
          </div>
        </section>

        <HomeSearch />

        {/* Product value + quick actions */}
        <section className="px-6 md:px-12 pt-2 pb-10">
          <div className="max-w-5xl mx-auto border-2 border-black p-5 md:p-6 bg-white text-center">
            <div className="inline-block bg-yellow-400 text-black text-xs font-black px-3 py-1 uppercase tracking-widest border-2 border-black mb-3">
              Why RateMyMajor
            </div>

            <p className="text-base leading-relaxed text-gray-700 max-w-3xl mx-auto">
              RateMyMajor helps students compare majors across schools using real
              student reviews, difficulty ratings, and outcomes. Browse verified
              institutions, explore departments, and share your own experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 max-w-xl mx-auto">
              <Link
                href="/school"
                className="px-5 py-3 border-2 border-black font-black uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                Browse Schools
              </Link>
              <Link
                href="/major"
                className="px-5 py-3 border-2 border-black font-black uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                Explore Majors
              </Link>
            </div>
          </div>
        </section>

      </div>
  );
}