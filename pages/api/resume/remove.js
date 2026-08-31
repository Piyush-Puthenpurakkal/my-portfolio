import { get, del } from "@vercel/blob";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user?.isAdmin) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);

    return res
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }

  try {
    const result = await get("resume.pdf", {
      access: "private",
    });

    if (!result || result.statusCode !== 200) {
      return res.status(404).json({
        message: "No resume found to remove.",
      });
    }

    await del(result.blob.url);

    return res.status(200).json({
      message: "Resume removed successfully.",
    });
  } catch (error) {
    console.error("Error removing resume:", error);

    return res.status(500).json({
      message: "Error removing resume.",
      error: error?.message || "Unknown error",
    });
  }
}