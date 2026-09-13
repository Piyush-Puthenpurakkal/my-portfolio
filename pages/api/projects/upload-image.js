import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";
import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = {
  "image/png": {
    extension: "png",
  },
  "image/jpeg": {
    extension: "jpg",
  },
  "image/webp": {
    extension: "webp",
  },
};

function getUploadedFile(files) {
  const uploaded = files.image;

  if (!uploaded) {
    return null;
  }

  return Array.isArray(uploaded) ? uploaded[0] : uploaded;
}

function detectImageType(buffer) {
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a,
      ])
    )
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
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

  const tempUploadDir = path.join(
    "/tmp",
    "project-image-upload"
  );

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
        message: "No image was uploaded.",
      });
    }

    const fileBuffer = await fs.readFile(file.filepath);
    const detectedType = detectImageType(fileBuffer);

    if (!detectedType || !ALLOWED_TYPES[detectedType]) {
      return res.status(400).json({
        message: "Only PNG, JPEG, and WebP images are allowed.",
      });
    }

    const filename = `${crypto.randomUUID()}.${
      ALLOWED_TYPES[detectedType].extension
    }`;

    const pathname = `project-images/${filename}`;

    const blob = await put(pathname, fileBuffer, {
      access: "private",
      contentType: detectedType,
      addRandomSuffix: false,
    });

    return res.status(200).json({
      message: "Project image uploaded successfully.",
      imageUrl: `/api/projects/image?pathname=${encodeURIComponent(
        blob.pathname
      )}`,
    });
  } catch (error) {
    console.error("Error uploading project image:", error);

    if (
      error?.code === "LIMIT_FILE_SIZE" ||
      error?.name === "BlobFileTooLargeError"
    ) {
      return res.status(413).json({
        message: "Image is too large. Maximum size is 10 MB.",
      });
    }

    return res.status(500).json({
      message: "Error uploading project image.",
    });
  } finally {
    try {
      const files = await fs.readdir(tempUploadDir);

      await Promise.all(
        files.map((filename) =>
          fs
            .unlink(path.join(tempUploadDir, filename))
            .catch(() => {})
        )
      );
    } catch {
      // Cleanup failure is non-fatal.
    }
  }
}
