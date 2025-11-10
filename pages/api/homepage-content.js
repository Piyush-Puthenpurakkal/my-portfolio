import dbConnect from "../../lib/mongodb";
import HomePageContent from "../../models/HomePageContent";
import { getSession } from "next-auth/react";

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
      const session = await getSession({ req });
      if (!session || !session.user.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const { title, summary } = req.body;
        if (typeof title !== "string" || typeof summary !== "string") {
          return res.status(400).json({ message: "Invalid content provided." });
        }

        let content = await HomePageContent.findOne();
        if (!content) {
          content = await HomePageContent.create({ title, summary });
        } else {
          content.title = title;
          content.summary = summary;
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
