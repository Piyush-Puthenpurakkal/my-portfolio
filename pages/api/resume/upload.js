import formidable from "formidable";
import fs from "fs";
import path from "path";
import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    const uploadDir = path.join(process.cwd(), "public", "resume");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filename: (name, ext, part) => {
        return `resume${ext}`; // Always name the resume file 'resume'
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res
          .status(500)
          .json({ message: "Error uploading resume", error: err.message });
      }

      const oldPath = files.resume[0].filepath;
      const newPath = path.join(uploadDir, `resume${path.extname(oldPath)}`);

      // Delete any existing resume files before renaming the new one
      fs.readdirSync(uploadDir).forEach((file) => {
        if (file.startsWith("resume") && file !== path.basename(newPath)) {
          fs.unlinkSync(path.join(uploadDir, file));
        }
      });

      fs.rename(oldPath, newPath, (renameErr) => {
        if (renameErr) {
          console.error("Error renaming file:", renameErr);
          return res
            .status(500)
            .json({ message: "Error saving resume", error: renameErr.message });
        }
        res
          .status(200)
          .json({
            message: "Resume uploaded successfully",
            filename: path.basename(newPath),
          });
      });
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
