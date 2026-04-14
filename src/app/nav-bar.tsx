"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending, refetch: refetchSession } = authClient.useSession();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    refetchSession();
  }, [pathname, refetchSession]);

  const isLoggedIn = !!session;

  const handleLogout = async () => {
    await authClient.signOut();
    await refetchSession();
    router.replace("/");
    router.refresh();
  };

  const linkClass = "px-3 py-3 md:px-8 md:py-6 text-xs md:text-base border-r-2 md:border-r-6 border-black hover:bg-black hover:text-white transition-colors uppercase cursor-pointer whitespace-nowrap";

  return (
    <nav className="w-full flex flex-col md:flex-row md:items-center md:justify-between border-b-6 border-black bg-white">
      <Link 
        href="/" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center px-4 md:px-8 py-2 md:py-4 border-r-2 md:border-r-6 border-black hover:bg-black transition-all duration-200"
      >
        <img 
          src={isHovered ? "/art_assets/RateMyMajorLogo(white).png" : "/art_assets/RateMyMajorLogo.png"} 
          alt="RateMyMajor" 
          className="h-8 md:h-12 w-auto object-contain" 
        />
      </Link>
      <div className="w-full md:w-auto flex items-center justify-center md:justify-end text-xs md:text-sm font-bold tracking-widest overflow-x-auto">
        {isPending ? (
          <div className="px-3 py-3 md:px-8 md:py-6 text-xs md:text-base border-l-2 md:border-l-6 border-black opacity-50 whitespace-nowrap uppercase">Loading...</div>
        ) : !isLoggedIn ? (
          <>
            <Link href="/signup" className={`border-l-2 md:border-l-6 ${linkClass}`}>SIGN UP</Link>
            <Link href="/signin" className={linkClass}>LOG IN</Link>
          </>
        ) : (
          <>
            <Link href="/school" className={`border-l-2 md:border-l-6 ${linkClass}`}>SCHOOLS</Link>
            <Link href="/profile" className={linkClass}>PROFILE</Link>
            <button onClick={handleLogout} className={`${linkClass} bg-red-50 hover:bg-red-500`}>
              LOG OUT
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
