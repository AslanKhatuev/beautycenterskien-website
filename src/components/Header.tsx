// components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="bg-black shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/beautycenter.jpg"
            alt="Massasjelogo"
            width={100} 
            height={70} 
            className="rounded-[10px]" 
            priority
          />
        </Link>
        <Navbar />
      </div>
    </header>
  );
}
