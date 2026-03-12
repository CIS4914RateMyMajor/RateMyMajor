import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "./actions/auth";
import Navbar from "./nav-bar";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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

        {/* Two-column text section */}
        <section className="grid grid-cols-2 gap-8 px-12 py-8 border-t-6 border-black">
          <p className="text-sm leading-relaxed text-gray-700">
            Lorem ipsum és un text de farciment usat per la indústria de la tipografia i la impremta.
            Lorem ipsum ha estat el text estàndard de la indústria des de l'any 1500, quan un impressor
            desconegut va fer servir una galerada de text i la va mesclar per crear un llibre de mostres
            tipogràfiques. No només ha sobreviscut cinc segles, sinó que ha fet el salt cap a la creació.
          </p>
          <p className="text-sm leading-relaxed text-gray-700 text-right">
            Lorem ipsum és un text de farciment usat per la indústria de la tipografia i la impremta.
            Lorem ipsum ha estat el text estàndard de la indústria des de l'any 1500, quan un impressor
            desconegut va fer servir una galerada de text i la va mesclar per crear un llibre de mostres
            tipogràfiques. No només ha sobreviscut cinc segles, sinó que ha fet el salt cap a la creació.
          </p>
        </section>

        {/* Full-width student photo */}
        <section className="w-full">
          <img
              src="/images/students.jpg"
              alt="Students in a classroom"
              className="w-full object-cover"
              style={{ maxHeight: "340px" }}
          />
        </section>

      </div>
  );
}