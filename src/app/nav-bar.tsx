"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { signOutAction } from "./actions/auth";

export default function NavBar() {
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session;

  const handleLogout = async () => {
    localStorage.removeItem("mock_user_logged_in");
    await signOutAction();
  };

  const linkClass = "px-8 py-6 text-base border-r-6 border-black hover:bg-black hover:text-white transition-colors uppercase cursor-pointer";

  return (
    <nav className="w-full flex items-center justify-between border-b-6 border-black bg-white">
      <Link href="/" className={`font-bold text-lg tracking-tight ${linkClass}`}>
        RateMyMajor
      </Link>

      <div className="flex items-center text-sm font-bold tracking-widest">
        {isPending ? (
          <div className="px-8 py-6 text-base border-l-6 border-black opacity-50">LOADING...</div>
        ) : !isLoggedIn ? (
          <>
            <Link href="/signup" className={`border-l-6 ${linkClass}`}>SIGN UP</Link>
            <Link href="/signin" className={linkClass}>LOG IN</Link>
          </>
        ) : (
          <>
            <Link href="/school" className={`border-l-6 ${linkClass}`}>SCHOOLS</Link>
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
