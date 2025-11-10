import fs from "fs";
import path from "path";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "DELETE") {
    const resumeDir = path.join(process.cwd(), "public", "resume");
    const files = fs.readdirSync(resumeDir);
    const resumeFile = files.find((file) => file.startsWith("resume"));

    if (!resumeFile) {
      return res.status(404).json({ message: "No resume found to remove." });
    }

    try {
      fs.unlinkSync(path.join(resumeDir, resumeFile));
      res.status(200).json({ message: "Resume removed successfully." });
    } catch (err) {
      console.error("Error removing resume file:", err);
      res
        .status(500)
        .json({ message: "Error removing resume.", error: err.message });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
