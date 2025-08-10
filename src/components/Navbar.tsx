"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Forside", href: "/" },
  { label: "Om oss", href: "/about" },
  { label: "Tjenester", href: "/tjenester" },
  { label: "Bestill time", href: "/booking" },
  { label: "Kontakt", href: "/kontakt" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // (valgfritt) Lås scroll når meny er åpen
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-8 text-white font-semibold text-lg">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="relative group">
            <span className="transition-colors duration-300 group-hover:text-pink-400">
              {link.label}
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </nav>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-white z-50 relative"
        onClick={() => setMenuOpen(true)}
        aria-label="Åpne meny"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <Menu size={28} />
      </button>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 bg-black/95 backdrop-blur-sm md:hidden z-50"
        >
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Lukk meny"
            className="absolute top-4 right-4 text-white p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <X size={28} />
          </button>

          {/* Links */}
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-xl font-semibold relative group"
              >
                <span className="transition-colors duration-300 group-hover:text-pink-400">
                  {link.label}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
