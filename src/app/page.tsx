import Navbar from "./nav-bar";
import Link from "next/link";
import HomeSearch from "./home-search";

export default async function Home() {
  return (
    <div className="relative min-h-screen bg-transparent text-black">
      <div 
        className="fixed bg-white inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "url('/art_assets/RateMyMajorBackground.png')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -1, 
        }}
      />

      <div className="relative z-10">
        <Navbar/>

        <section className="flex flex-col items-center justify-center px-4 md:px-8">
          <div className="flex items-center justify-center w-full">
            <img 
              src="/art_assets/RateMyMajorLogo.png" 
              alt="RateMyMajor" 
              className="w-full max-w-3xl md:max-w-4xl md:py-28 h-auto object-contain my-16 md:my-24" 
            />
          </div>
      </section>

        {/* Product value + quick actions */}
        <section className="px-6 md:px-12 pt-2 pb-10">
          <div className="max-w-5xl mx-auto border-6 border-black p-5 md:p-6 bg-[#B1A088] text-center  shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <div className="inline-block bg-yellow-400 text-black text-s-bold font-black px-3 py-1 uppercase tracking-widest border-2 border-black mb-3">
                Why RateMyMajor
            </div>

            <p className="text-base leading-relaxed text-black-700-bold max-w-3xl mx-auto">
              RateMyMajor helps students compare majors across schools using real
              student reviews, difficulty ratings, and outcomes. Browse verified
              institutions, explore departments, and share your own experience.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5 max-w-xl mx-auto">
              <Link
                href="/school"
                className="px-5 py-3 border-2 border-black bg-white font-black uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                Browse Schools
              </Link>
              <Link
                href="/major"
                className="px-5 py-3 border-2 border-black bg-white font-black uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                Explore Majors
              </Link>
            </div>
          </div>
        </section>

        <HomeSearch />


      </div>
    </div>
  );
}
