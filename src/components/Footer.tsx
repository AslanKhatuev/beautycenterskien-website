import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, PhoneCall, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 border-b border-gray-700 pb-10">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Link href="/">
            <Image
              src="/beautycenter.jpg"
              alt="Logo"
              width={140}
              height={70}
              style={{ height: "auto" }}
              className="rounded-xl shadow-md hover:scale-105 transition"
            />
          </Link>
          <p className="text-sm text-gray-400 text-center md:text-left">
            Velvære, skjønnhet og profesjonell behandling i hjertet av Skien.
          </p>
        </div>

        {/* Navigasjon */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-pink-400 uppercase tracking-wider">
            Navigasjon
          </h2>
          <nav className="flex flex-col items-center text-sm space-y-2 text-gray-300">
            {[
              { label: "Hjem", href: "/" },
              { label: "Om oss", href: "/about" },
              { label: "Tjenester", href: "/tjenester" },
              { label: "Booking", href: "/booking" },
              { label: "Kontakt", href: "/kontakt" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition hover:text-pink-400 hover:scale-105"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sosiale medier */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <h2 className="text-lg font-semibold mb-2 text-pink-400 uppercase tracking-wider">
            Følg oss
          </h2>
          <div className="flex flex-col space-y-2 text-sm text-gray-300">
            <a
              href="https://www.facebook.com/share/14G13ZPiVgy/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-pink-400 hover:scale-105"
            >
              <Facebook size={18} />
              Facebook
            </a>
            <a
              href="https://www.instagram.com/beautycenter_skien?igsh=MjIxZnoyMzZhajlm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-pink-400 hover:scale-105"
            >
              <Instagram size={18} />
              Instagram
            </a>
            <a
              href="https://t.me/ElizabethMolly"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-pink-400 hover:scale-105"
            >
              <Send size={18} />
              Telegram
            </a>
            <a
              href="https://wa.me/4796809506"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-pink-400 hover:scale-105"
            >
              <PhoneCall size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="text-center text-xs text-gray-400 mt-8 space-y-2">
        <p>&copy; {new Date().getFullYear()} Beauty Center Skien.</p>
        <div className="flex flex-col items-center mt-2 space-y-1">
          <p className="text-sm">Utviklet av:</p>
          <a
            href="https://www.instagram.com/skyline.interface?igsh=MWZycDBkcWZlcjJ4ZQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition"
          >
            <Image
              src="/skyline1.jpeg"
              alt="Skyline Interface Logo"
              width={140}
              height={70}
              style={{ height: "auto" }}
              className="mx-auto rounded-xl shadow"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
