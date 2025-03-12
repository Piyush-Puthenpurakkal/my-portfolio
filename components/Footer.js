import { signOut, useSession } from "next-auth/react";

export default function Footer() {
  const { data: session } = useSession();

  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="hidden md:flex items-center justify-between">
        <div className="w-1/3"></div>
        <div className="w-1/3 text-center">
          <p>
            &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
          </p>
        </div>
        <div className="w-1/3 text-right">
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-blue-400 hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      <div className="md:hidden text-center">
        <p>
          &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
