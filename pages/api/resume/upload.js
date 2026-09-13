import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { put, list, del } from "@vercel/blob";
import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getUploadedFile(files) {
  const uploaded = files.resume;

  if (!uploaded) {
    return null;
  }

  return Array.isArray(uploaded) ? uploaded[0] : uploaded;
}

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user?.isAdmin) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }

  const tempUploadDir = path.join("/tmp", "resume-upload");

  try {
    await fs.mkdir(tempUploadDir, {
      recursive: true,
    });

    const form = formidable({
      uploadDir: tempUploadDir,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
      multiples: false,
    });

    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, parsedFiles) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({
          fields,
          files: parsedFiles,
        });
      });
    });

    const file = getUploadedFile(files);

    if (!file) {
      return res.status(400).json({
        message: "No resume file was uploaded.",
      });
    }

    const originalName =
      file.originalFilename || "resume.pdf";

    const extension = path
      .extname(originalName)
      .toLowerCase();

    if (extension !== ".pdf") {
      return res.status(400).json({
        message: "Only PDF resume files are allowed.",
      });
    }

    const contentType =
      file.mimetype || "application/pdf";

    if (contentType !== "application/pdf") {
      return res.status(400).json({
        message: "The uploaded file must be a PDF.",
      });
    }

    const fileBuffer = await fs.readFile(file.filepath);

    const blob = await put("resume.pdf", fileBuffer, {
      access: "private",
      contentType: "application/pdf",
      allowOverwrite: true,
    });

    try {
      const { blobs } = await list({
        prefix: "resume",
      });

      const oldResumeBlobs = blobs.filter(
        (existingBlob) =>
          existingBlob.pathname.startsWith("resume") &&
          existingBlob.url !== blob.url
      );

      if (oldResumeBlobs.length > 0) {
        await del(
          oldResumeBlobs.map(
            (existingBlob) => existingBlob.url
          )
        );
      }
    } catch (cleanupError) {
      console.error(
        "Resume cleanup failed:",
        cleanupError
      );
    }

    return res.status(200).json({
      message: "Resume uploaded successfully.",
      filename: "resume.pdf",
      url: blob.url,
    });
  } catch (error) {
    console.error(
      "Error uploading resume:",
      error
    );

    if (
      error?.code === "LIMIT_FILE_SIZE" ||
      error?.name === "BlobFileTooLargeError"
    ) {
      return res.status(413).json({
        message:
          "Resume file is too large. Maximum size is 5 MB.",
      });
    }

    return res.status(500).json({
      message: "Error uploading resume.",
      error:
        error?.message ||
        "Unknown error",
    });
  } finally {
    try {
      const files = await fs.readdir(tempUploadDir);

      await Promise.all(
        files.map((filename) =>
          fs
            .unlink(
              path.join(
                tempUploadDir,
                filename
              )
            )
            .catch(() => {})
        )
      );
    } catch {
      // Cleanup failure is non-fatal.
    }
  }
}