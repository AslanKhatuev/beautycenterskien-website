import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, PhoneCall, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Link href="/">
            <Image
              src="/beautycenter.jpg"
              alt="Logo"
              width={120}
              height={60}
              className="rounded-xl"
            />
          </Link>
        </div>

        {/* Navigasjon */}
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-lg font-semibold mb-2">Navigasjon</h2>
          <nav className="flex flex-col items-center text-sm space-y-1">
            <Link
              href="/"
              className="hover:text-pink-400 hover:underline transition"
            >
              Hjem
            </Link>
            <Link
              href="/about"
              className="hover:text-pink-400 hover:underline transition"
            >
              Om oss
            </Link>
            <Link
              href="/tjenester"
              className="hover:text-pink-400 hover:underline transition"
            >
              Tjenester
            </Link>
            <Link
              href="/booking"
              className="hover:text-pink-400 hover:underline transition"
            >
              Booking
            </Link>
            <Link
              href="/kontakt"
              className="hover:text-pink-400 hover:underline transition"
            >
              Kontakt
            </Link>
          </nav>
        </div>

        {/* Sosiale medier */}
        <div className="flex flex-col items-center md:items-end space-y-2">
          <h2 className="text-lg font-semibold mb-2">Følg oss</h2>
          <div className="flex flex-col text-sm space-y-2">
            <a
              href="https://www.facebook.com/share/14G13ZPiVgy/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center space-x-2 hover:text-pink-400 hover:underline transition"
            >
              <Facebook size={18} />
              <span>Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/beautycenter_skien?igsh=MjIxZnoyMzZhajlm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center space-x-2 hover:text-pink-400 hover:underline transition"
            >
              <Instagram size={18} />
              <span>Instagram</span>
            </a>
            <a
              href="https://t.me/ElizabethMolly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="flex items-center space-x-2 hover:text-pink-400 hover:underline transition"
            >
              <Send size={18} />
              <span>Telegram</span>
            </a>
            <a
              href="https://wa.me/4796809506"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex items-center space-x-2 hover:text-pink-400 hover:underline transition"
            >
              <PhoneCall size={18} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="text-center text-xs text-gray-400 mt-8 space-y-2">
        <p>&copy; {new Date().getFullYear()} Beauty Center Skien.</p>

        {/* Utviklet av */}
        <div className="flex flex-col items-center mt-2 space-y-1">
          <a
            href="https://www.instagram.com/skyline.interface?igsh=MWZycDBkcWZlcjJ4ZQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition"
          >
            <Image
              src="/skyline1.jpeg"
              alt="Skyline Interface Logo"
              width={120}
              height={60}
              className="mx-auto rounded shadow"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
