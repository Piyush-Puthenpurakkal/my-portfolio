import dbConnect from "../../lib/mongodb";
import HomePageContent from "../../models/HomePageContent";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]"; // Import authOptions

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        let content = await HomePageContent.findOne();
        if (!content) {
          content = await HomePageContent.create({}); // Create with default values
        }
        res.status(200).json(content);
      } catch (error) {
        console.error("Error fetching homepage content:", error);
        res.status(500).json({ message: "Error fetching homepage content." });
      }
      break;

    case "PUT":
      console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET); // Log NEXTAUTH_SECRET
      const session = await getServerSession(req, res, authOptions); // Use getServerSession
      console.log("API Route Session:", session); // Log the session object
      if (!session || !session.user.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const { title, summary } = req.body;
        let content = await HomePageContent.findOne();

        if (!content) {
          // If no content exists, create it with provided fields or defaults
          content = await HomePageContent.create({
            title: title || "",
            summary: summary || "",
          });
        } else {
          // Update only the fields that are provided in the request body
          if (title !== undefined) {
            if (typeof title !== "string") {
              return res
                .status(400)
                .json({ message: "Invalid title provided." });
            }
            content.title = title;
          }
          if (summary !== undefined) {
            if (typeof summary !== "string") {
              return res
                .status(400)
                .json({ message: "Invalid summary provided." });
            }
            content.summary = summary;
          }
          await content.save();
        }
        res
          .status(200)
          .json({ message: "Homepage content updated successfully." });
      } catch (error) {
        console.error("Error updating homepage content:", error);
        res.status(500).json({ message: "Error updating homepage content." });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
