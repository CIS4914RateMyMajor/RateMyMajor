"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Use Link for faster Next.js navigation

export default function NavBar() {
    // 1. MOCK STATE: Change this to 'true' to see the logged-in view
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Optional: Simple logic to "remember" login during your dev session
    useEffect(() => {
        const mockAuth = localStorage.getItem("mock_user_logged_in");
        if (mockAuth === "true") setIsLoggedIn(true);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("mock_user_logged_in");
        setIsLoggedIn(false);
        window.location.href = "/"; // Redirect to home on logout
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
                <a href="/" className="font-bold text-lg tracking-tight px-8 py-6 uppercase border-r-6 border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
                RateMyMajor
                </a>
            )}
            <div className="flex items-center text-sm font-bold tracking-widest">
                {!isLoggedIn ? (
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
