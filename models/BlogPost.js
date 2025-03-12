import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  excerpt: { type: String },
  content: { type: String, required: true },
});

export default mongoose.models.BlogPost ||
  mongoose.model("BlogPost", BlogPostSchema);
