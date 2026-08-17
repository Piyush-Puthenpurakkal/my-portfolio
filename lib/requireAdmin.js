import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export async function requireAdmin(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.isAdmin) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  return session;
}