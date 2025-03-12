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
      <header className="bg-gray-800 text-white p-4 shadow-md hidden md:flex items-center justify-between">
        <div className="text-xl font-bold">My Portfolio</div>
        <nav>
          <ul className="flex space-x-4">
            {navigationLinks.map((link, index) => (
              <li key={index}>
                <Link legacyBehavior href={link.href}>
                  <a className="hover:text-blue-300">{link.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="bg-gray-800 text-white p-4 shadow-md flex md:hidden items-center">
        <button onClick={() => setSidebarOpen(true)} className="mr-4">
          <FaBars className="h-6 w-6" />
        </button>
        <div className="text-xl font-bold">My Portfolio</div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          {/* Sidebar */}
          <div className="relative bg-gray-800 text-white w-64 h-full p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Menu</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              <nav>
                <ul className="space-y-4">
                  {navigationLinks.map((link, index) => (
                    <li key={index}>
                      <Link legacyBehavior href={link.href}>
                        <a
                          onClick={() => setSidebarOpen(false)}
                          className="hover:text-blue-300"
                        >
                          {link.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            {/* Logout button at the bottom (only on mobile) - left aligned */}
            {session && (
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setSidebarOpen(false);
                }}
                className="w-full text-left text-blue-400 hover:underline"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
