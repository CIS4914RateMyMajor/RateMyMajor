"use client"
import { useState } from "react" ;
import "./globals.css";

interface NavBarProps{
    brandName: string;
    imageSrcPath: string;
    navItems: string[];
}

export default function NavBar ({ brandName, imageSrcPath, navItems}: NavBarProps) {

    const [selectedIndex, setSelectedIndex] = useState(-1);

    return (
        <nav className="flex items-center justify-between p-4">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img
                        src = {imageSrcPath}
                        width = "120"
                        height = "60"
                        className = "d-inline-block align-center"
                        alt = " "
                        />
                    <span className="fw-bolder fs-4">{brandName}</span>
                </a>

            </div>
        </nav>
    )
}
