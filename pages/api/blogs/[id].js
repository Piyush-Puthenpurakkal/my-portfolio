import connectToDatabase from "../../../lib/mongodb";
import BlogPost from "../../../models/BlogPost";

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const post = await BlogPost.findById(id);
      if (!post) return res.status(404).json({ error: "Blog post not found" });
      res.status(200).json({ post });
    } catch (error) {
      res.status(500).json({ error: "Error fetching blog post" });
    }
  } else if (req.method === "PUT") {
    try {
      const post = await BlogPost.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!post) return res.status(404).json({ error: "Blog post not found" });
      res.status(200).json({ message: "Blog post updated", post });
    } catch (error) {
      res.status(500).json({ error: "Error updating blog post" });
    }
  } else if (req.method === "DELETE") {
    try {
      const post = await BlogPost.findByIdAndDelete(id);
      if (!post) return res.status(404).json({ error: "Blog post not found" });
      res.status(200).json({ message: "Blog post deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting blog post" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
