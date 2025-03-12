import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function BlogPage() {
  const { data, error } = useSWR("/api/blogs", fetcher);

  if (error) return <div className="p-8">Failed to load blog posts.</div>;
  if (!data) return <div className="p-8">Loading blog posts...</div>;

  const posts = data.posts || [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <motion.div
            key={post.slug}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {post.formattedDate || post.date}
            </p>
            <p className="mb-4">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} legacyBehavior>
              <a className="text-blue-500 hover:underline">Read More</a>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
