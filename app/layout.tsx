import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { mockPosts } from "@/lib/mockPosts";
import { FeaturedSidebar } from "@/components/FeaturedSidebar";
import { HeaderNav } from "@/components/HeaderNav";

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
    "font-bold text-md tracking-widest px-4 py-3 rounded-lg transition-colors hover:text-gray-900 hover:bg-[linear-gradient(100deg,_#D2F3FC,_#FACFCE)]";

  const links = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/posts", label: "Publier", icon: "pen" },
    { href: "/archives", label: "Archives", icon: "archive" },
    { href: "/users", label: "Utilisateurs", icon: "users" },
  ] as const;

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

            <HeaderNav
              links={links}
              className="flex flex-col gap-4"
              linkBaseClass={navLinkClass}
            />

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
