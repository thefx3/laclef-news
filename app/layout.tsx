import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Home, PenSquare, Archive, Users } from "lucide-react";
import { mockPosts } from "@/lib/mockPosts";
import { FeaturedSidebar } from "@/components/FeaturedSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isActiveFeatured(now: Date) {
  const today = startOfDay(now);
  return mockPosts.filter((post) => {
    if (post.type !== "A_LA_UNE") return false;

    const start = startOfDay(post.startAt);
    const end = post.endAt ? startOfDay(post.endAt) : start;

    return start <= today && today <= end;
  });
}

export const metadata: Metadata = {
  title: "La CLEF News",
  description: "Stay updated with the latest news from La CLEF",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  const navLinkClass =
  "font-bold text-md tracking-widest text-gray-700 px-4 py-3 rounded-lg transition-colors hover:text-gray-900 hover:bg-[linear-gradient(100deg,_#D2F3FC,_#FACFCE)] text-gray-900 active:bg-[linear-gradient(100deg,_#D2F3FC,_#FACFCE)]";

  const links = [
    { href: "/", label: "Home", Icon: Home },
    { href: "/posts", label: "Publier", Icon: PenSquare },
    { href: "/archives", label: "Archives", Icon: Archive },
    { href: "/users", label: "Utilisateurs", Icon: Users },
  ];

  const featured = isActiveFeatured(new Date());

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* HEADER */}
        <div className="min-h-screen w-full flex flex-col gap-4 py-1 px-1 lg:flex-row">
          <header className="hidden p-4 rounded-xl bg-white shadow-sm w-full lg:block md:w-64">

            <Link href="/" className="font-bold tracking-[0.25em] text-2xl uppercase py-2 px-4 mb-4 inline-block">
                La CLEF
            </Link>

            <nav className="flex flex-col gap-4">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${navLinkClass} inline-flex items-center gap-2`}
              >
                <link.Icon className="h-4 w-4" aria-hidden="true" />
                {link.label}
              </Link>
            ))}
            </nav>

          </header>

          <main className="flex flex-col bg-white rounded-xl p-4 w-full min-h-screen shadow-sm min-w-0 gap-2">
            <header className="flex w-full border px-4 py-3 rounded-xl bg-white shadow-sm">
            Something to write here !
            </header>
            {children}
          </main>

          <FeaturedSidebar posts={featured} />
        </div>
      </body>
    </html>
  );
}
