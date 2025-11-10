import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const resumeDir = path.join(process.cwd(), "public", "resume");
  const files = fs.readdirSync(resumeDir);
  const resumeFile = files.find((file) => file.startsWith("resume"));

  if (!resumeFile) {
    return res.status(404).json({ message: "Resume not found" });
  }

  const filePath = path.join(resumeDir, resumeFile);
  const stat = fs.statSync(filePath);

  if (req.method === "GET") {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resumeFile}"`
    );
    res.setHeader("Content-Type", "application/pdf"); // Assuming PDF, adjust if other formats are allowed
    res.setHeader("Content-Length", stat.size);

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } else if (req.method === "HEAD") {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", stat.size);
    res.status(200).end();
  } else {
    res.setHeader("Allow", ["GET", "HEAD"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
