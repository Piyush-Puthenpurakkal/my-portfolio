import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Projects", href: "/projects" },
    { name: "Accomplishments", href: "/accomplishments" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 hidden h-[72px] items-center justify-between border-b border-slate-700/50 bg-slate-900 px-6 text-white shadow-lg md:flex lg:px-10">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:text-blue-400"
        >
          My Portfolio
        </Link>

        <nav>
          <ul className="flex items-center gap-7">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-200 hover:text-blue-400"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-[72px] items-center bg-slate-900 px-5 text-white shadow-lg md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
          className="mr-4 rounded-lg p-2 text-slate-200 hover:bg-white/10 hover:text-white"
        >
          <FaBars className="h-5 w-5" />
        </button>

        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:text-blue-400"
        >
          My Portfolio
        </Link>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <aside className="relative flex h-full w-[290px] flex-col justify-between bg-slate-900 p-6 text-white shadow-2xl">
            <div>
              <div className="mb-10 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Menu</h2>

                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close navigation menu"
                  className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <nav>
                <ul className="space-y-2">
                  {navigationLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className="block rounded-lg px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/10 hover:text-blue-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {session && (
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setSidebarOpen(false);
                }}
                className="w-full rounded-lg border border-red-400/20 px-3 py-3 text-left text-sm font-medium text-red-400 hover:bg-red-400/10"
              >
                Logout
              </button>
            )}
          </aside>
        </div>
      )}
    </>
  );
}