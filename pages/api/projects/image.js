import { get } from "@vercel/blob";
import { Readable } from "node:stream";

const PROJECT_IMAGE_PREFIX = "project-images/";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", ["GET", "HEAD"]);

    return res
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }

  const pathname = req.query.pathname;

  if (
    typeof pathname !== "string" ||
    !pathname.startsWith(PROJECT_IMAGE_PREFIX) ||
    pathname.includes("..") ||
    pathname.includes("\\")
  ) {
    return res.status(400).json({
      message: "Invalid image path.",
    });
  }

  try {
    const result = await get(pathname, {
      access: "private",
    });

    if (!result || result.statusCode !== 200) {
      return res.status(404).json({
        message: "Image not found.",
      });
    }

    const contentType = result.blob.contentType || "image/jpeg";

    if (
      ![
        "image/png",
        "image/jpeg",
        "image/webp",
      ].includes(contentType)
    ) {
      return res.status(404).json({
        message: "Invalid image type.",
      });
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    if (req.method === "HEAD") {
      return res.status(200).end();
    }

    return Readable.fromWeb(result.stream).pipe(res);
  } catch (error) {
    console.error("Error serving project image:", error);

    return res.status(404).json({
      message: "Image not found.",
    });
  }
}
