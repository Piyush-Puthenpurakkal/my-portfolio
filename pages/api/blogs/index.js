import connectToDatabase from "../../../lib/mongodb";
import BlogPost from "../../../models/BlogPost";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const posts = await BlogPost.find({});
      res.status(200).json({ posts });
    } catch (error) {
      res.status(500).json({ error: "Error fetching blog posts" });
    }
  } else if (req.method === "POST") {
    try {
      const post = new BlogPost(req.body);
      await post.save();
      res.status(201).json({ message: "Blog post created successfully", post });
    } catch (error) {
      res.status(500).json({ error: "Error creating blog post" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
