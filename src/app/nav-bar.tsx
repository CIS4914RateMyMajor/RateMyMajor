"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { signOutAction } from "./actions/auth";

export default function NavBar() {
    const { data: session, isPending } = authClient.useSession();
    const isLoggedIn = !!session;

    const handleLogout = async () => {
        // Clear mock auth just in case
        localStorage.removeItem("mock_user_logged_in");
        await signOutAction();
    };

    return (
      <nav className="w-full flex items-center justify-between border-b-6 border-black bg-white">
        {isLoggedIn ? (
          /* Link is active ONLY when logged in */
          <span className="font-bold text-lg tracking-tight px-8 py-6 uppercase border-r-6 border-black cursor-default">
            RateMyMajor
          </span>
        ) : (
          /* Plain text when logged out - no link, no hover effect */
          <a
            href="/"
            className="font-bold text-lg tracking-tight px-8 py-6 uppercase border-r-6 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            RateMyMajor
          </a>
        )}
        <div className="flex items-center text-sm font-bold tracking-widest">
          {isPending ? (
            <div className="px-8 py-6 text-base border-l-6 border-black opacity-50">
              LOADING...
            </div>
          ) : !isLoggedIn ? (
            /* --- LOGGED OUT VIEW --- */
            <>
              <Link
                href="/signup"
                className="px-8 py-6 text-base border-l-6 border-r-6 border-black hover:bg-black hover:text-white transition-colors"
              >
                SIGN UP
              </Link>
              <Link
                href="/signin"
                className="px-8 py-6 text-base border-r-6 border-black hover:bg-black hover:text-white transition-colors"
              >
                LOG IN
              </Link>
            </>
          ) : (
            /* --- LOGGED IN VIEW --- */
            <>
              <Link
                href="/school"
                className="px-8 py-6 text-base border-l-6 border-r-6 border-black hover:bg-black hover:text-white transition-colors"
              >
                SCHOOLS
              </Link>
              <Link
                href="/profile"
                className="px-8 py-6 text-base border-r-6 border-black hover:bg-black hover:text-white transition-colors"
              >
                PROFILE
              </Link>
              <button
                onClick={handleLogout}
                className="px-8 py-6 text-base border-r-6 border-black bg-red-50 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
              >
                LOG OUT
              </button>
            </>
          )}
        </div>
      </nav>
    );
}
