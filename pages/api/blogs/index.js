import connectToDatabase from "../../../lib/mongodb";
import BlogPost from "../../../models/BlogPost";
import { requireAdmin } from "../../../lib/requireAdmin";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
  try {
    const { slug } = req.query;

    if (slug) {
      const post = await BlogPost.findOne({ slug });

      if (!post) {
        return res.status(404).json({
          error: "Blog post not found",
        });
      }

      return res.status(200).json({ post });
    }

    const posts = await BlogPost.find({}).sort({ date: -1 });

    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);

    return res.status(500).json({
      error: "Error fetching blog posts",
    });
  }
} else if (req.method === "POST") {
    const session = await requireAdmin(req, res);

    if (!session) {
      return;
    }

    try {
      const post = new BlogPost(req.body);
      await post.save();

      res.status(201).json({
        message: "Blog post created successfully",
        post,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error creating blog post",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}