import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, PhoneCall, Send } from "lucide-react"; // Send = Telegram

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Logo */}
        <div className="flex flex-col items-start space-y-4">
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
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Navigasjon</h2>
          <nav className="flex flex-col items-center space-y-2 text-sm">
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
          <div className="flex flex-col space-y-2 text-sm">
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
              href="https://t.me/ElizabethMolly" // <-- Endre til din Telegram-link
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="flex items-center space-x-2 hover:text-pink-400 hover:underline transition"
            >
              <Send size={18} />
              <span>Telegram</span>
            </a>
            <a
              href="https://wa.me/4796809506" // <-- Sett inn riktig norsk nummer
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

      {/* Copyright */}
      <p className="text-center text-xs text-gray-400 mt-8">
        &copy; {new Date().getFullYear()} Beautycenter Skien.
      </p>
    </footer>
  );
}
