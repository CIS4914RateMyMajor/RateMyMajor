"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [session, setSession] = useState<any>(null);
  const [isPending, setIsPending] = useState(true);

  const syncSession = useCallback(async () => {
    setIsPending(true);
    try {
      const result = await authClient.getSession();
      setSession(result?.data ?? null);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    syncSession();
  }, [pathname, syncSession]);

  useEffect(() => {
    const onFocus = () => {
      syncSession();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [syncSession]);

  const isLoggedIn = !!session;

  const handleLogout = async () => {
    await authClient.signOut();
    await syncSession();
    router.replace("/");
    router.refresh();
    window.location.reload();
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
