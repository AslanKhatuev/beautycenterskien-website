"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Hjem", href: "/" },
  { label: "Om oss", href: "/about" },
  { label: "Tjenester", href: "/tjenester" },
  { label: "Booking", href: "/booking" },
  { label: "Kontakt", href: "/kontakt" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-8 text-white font-semibold text-lg">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="relative group">
            <span className="transition-colors duration-300 group-hover:text-pink-400">
              {link.label}
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </nav>

      {/* Mobile nav toggle */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black shadow-md flex flex-col items-center space-y-4 py-6 md:hidden z-50 text-white">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-lg hover:text-pink-400 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
