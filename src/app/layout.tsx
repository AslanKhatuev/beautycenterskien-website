// app/layout.tsx
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Beauty Center Skien",
  description: "Velkommen til Beauty Center Skien",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="icon" href="/beauty.png" type="image/x-icon" />
        <title>Beauty Center Skien</title>
        <meta name="description" content="Velkommen til Beauty Center Skien" />
      </head>
      <body
        className="min-h-screen flex flex-col"
        suppressHydrationWarning={true}
      >
        <Header />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
