import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function BlogCard({ post }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {post.formattedDate || format(new Date(post.date), "MM/dd/yyyy")}
      </p>
      <p className="mb-4">{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} legacyBehavior>
        <a className="text-blue-500 hover:underline">Read More</a>
      </Link>
    </motion.div>
  );
}
