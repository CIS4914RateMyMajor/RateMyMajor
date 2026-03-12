"use client"
import { useState } from "react" ;
import "./globals.css";

// interface NavBarProps{
//     brandName: string;
//     imageSrcPath: string;
//     navItems: string[];
// }

export default function NavBar () {

    const [selectedIndex, setSelectedIndex] = useState(-1);

    return (
        <nav className="flex items-center justify-between px-0 py-0 border-b-6 border-black">
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight ml-5">{"RateMyMajor"}</span>
            </div>
            <div className="flex items-center text-sm font-bold tracking-widest">
                <a href="/signup" className="px-8 py-6 text-base border-l-6 border-t-0 border-b-0 border-r-6 border-black hover:bg-black hover:text-white transition-colors">
                SIGN UP
                </a>
                <a href="/login" className="px-8 py-6 text-base border-l border-t-0 border-b-0 border-r-6 border-black hover:bg-black hover:text-white transition-colors">
                LOG IN
                </a>
            </div>
        </nav>
    );
}
