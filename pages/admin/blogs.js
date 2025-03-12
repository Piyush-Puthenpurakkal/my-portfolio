import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/admin/blogs",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminBlogs() {
  const { data, error } = useSWR("/api/blogs", fetcher);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const router = useRouter();

  async function handleAddBlog(e) {
    e.preventDefault();
    const newBlog = { title, slug, date, excerpt, content };
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBlog),
    });
    if (res.ok) {
      mutate("/api/blogs");
      setTitle("");
      setSlug("");
      setDate("");
      setExcerpt("");
      setContent("");
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    const updatedBlog = { title, slug, date, excerpt, content };
    const res = await fetch(`/api/blogs/${editingPostId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBlog),
    });
    if (res.ok) {
      mutate("/api/blogs");
      setEditingPostId(null);
      setTitle("");
      setSlug("");
      setDate("");
      setExcerpt("");
      setContent("");
    }
  }

  const startEdit = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setSlug(post.slug);
    setDate(post.date ? post.date.substring(0, 10) : "");
    setExcerpt(post.excerpt);
    setContent(post.content);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        mutate("/api/blogs");
      }
    }
  };

  if (error) return <div className="p-8">Failed to load blog posts.</div>;
  if (!data) return <div className="p-8">Loading blog posts...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Blog Posts</h1>
      <form
        onSubmit={editingPostId ? handleEdit : handleAddBlog}
        className="mb-6 space-y-4 border p-4 rounded"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingPostId ? "Update Post" : "Add Post"}
          </button>
          {editingPostId && (
            <button
              type="button"
              onClick={() => {
                setEditingPostId(null);
                setTitle("");
                setSlug("");
                setDate("");
                setExcerpt("");
                setContent("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      <ul>
        {data.posts.map((post) => (
          <li key={post._id} className="border p-4 rounded mb-2">
            <h2 className="font-bold">{post.title}</h2>
            <p>Slug: {post.slug}</p>
            <p>Date: {post.date ? post.date.substring(0, 10) : ""}</p>
            <p>Excerpt: {post.excerpt}</p>
            <div className="mt-2">
              <button
                onClick={() => startEdit(post)}
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
