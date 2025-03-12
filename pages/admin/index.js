import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import Link from "next/link";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/admin",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}

export default function AdminDashboard({ session }) {
  const { data: clientSession, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  const user = clientSession?.user || session?.user;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <ul className="mt-4">
        <li>
          <Link
            href="/admin/projects"
            className="text-blue-500 hover:underline"
          >
            Manage Projects
          </Link>
        </li>
        <li>
          <Link href="/admin/blogs" className="text-blue-500 hover:underline">
            Manage Blog Posts
          </Link>
        </li>
        <li>
          <Link
            href="/admin/accomplishments"
            className="text-blue-500 hover:underline"
          >
            Manage Accomplishments
          </Link>
        </li>
      </ul>
    </div>
  );
}
