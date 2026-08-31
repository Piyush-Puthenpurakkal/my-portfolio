import { get } from "@vercel/blob";
import { getSession } from "next-auth/react";
import { Readable } from "node:stream";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user?.isAdmin) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", ["GET", "HEAD"]);

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
        message: "Resume not found",
      });
    }

    res.setHeader(
      "Content-Type",
      result.blob.contentType || "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="resume.pdf"'
    );

    res.setHeader(
      "X-Content-Type-Options",
      "nosniff"
    );

    res.setHeader(
      "Cache-Control",
      "private, no-cache"
    );

    if (result.blob.size) {
      res.setHeader(
        "Content-Length",
        result.blob.size
      );
    }

    if (req.method === "HEAD") {
      return res.status(200).end();
    }

    Readable.fromWeb(result.stream).pipe(res);
  } catch (error) {
    console.error("Error downloading resume:", error);

    return res.status(500).json({
      message: "Error downloading resume.",
      error: error?.message || "Unknown error",
    });
  }
}