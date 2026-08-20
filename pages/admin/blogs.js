import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import Link from "next/link";

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/admin/blogs",
        permanent: false,
      },
    };
  }

  if (!session.user?.isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { session } };
}

const fetcher = (url) => fetch(url).then((res) => res.json());

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

export default function AdminBlogs() {
  const { data, error } = useSWR("/api/blogs", fetcher);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [editingPostId, setEditingPostId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  function clearForm() {
    setTitle("");
    setSlug("");
    setDate("");
    setExcerpt("");
    setContent("");
    setEditingPostId(null);
    setMessage("");
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setFormError("");

    const blog = {
      title: title.trim(),
      slug: slug.trim(),
      date,
      excerpt: excerpt.trim(),
      content,
    };

    try {
      const response = await fetch(
        editingPostId ? `/api/blogs/${editingPostId}` : "/api/blogs",
        {
          method: editingPostId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blog),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save article.");
      }

      await mutate("/api/blogs");

      clearForm();

      setMessage(
        editingPostId
          ? "Article updated successfully."
          : "Article published successfully."
      );
    } catch (err) {
      setFormError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(post) {
    setEditingPostId(post._id);
    setTitle(post.title || "");
    setSlug(post.slug || "");
    setDate(post.date ? post.date.substring(0, 10) : "");
    setExcerpt(post.excerpt || "");
    setContent(post.content || "");

    setMessage("");
    setFormError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    setDeletingId(id);
    setMessage("");
    setFormError("");

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete article.");
      }

      await mutate("/api/blogs");

      setMessage("Article deleted successfully.");
    } catch (err) {
      setFormError(err.message || "Unable to delete article.");
    } finally {
      setDeletingId(null);
    }
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="page-container py-24">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-xl font-bold text-red-800">
              Unable to load articles
            </h1>

            <p className="mt-2 text-sm text-red-600">
              Please try again in a moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="page-container py-24 text-center">
          <p className="text-sm font-medium text-slate-500">
            Loading articles...
          </p>
        </div>
      </main>
    );
  }

  const posts = [...(data.posts || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-slate-950 text-white">
        <div className="page-container py-14 sm:py-16">
          <Link
            href="/admin"
            className="text-sm font-semibold text-blue-300 hover:text-blue-200"
          >
            ← Dashboard
          </Link>

          <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Content Management
              </p>

              <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
                Blog
              </h1>

              <p className="mt-3 text-slate-300">
                Write, edit, and manage your articles.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </div>
        </div>
      </section>

      <div className="page-container py-10 sm:py-14">
        {/* Editor */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
              {editingPostId ? "Editing Article" : "New Article"}
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
              {editingPostId ? "Update article" : "Write an article"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article title"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Slug
                </label>

                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-new-article"
                  className={inputClass}
                  required
                />

                <p className="mt-2 text-xs text-slate-400">
                  Used in the article URL.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Publication date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputClass} max-w-xs`}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Excerpt
              </label>

              <textarea
                rows="3"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short description shown on the Blog page."
                className={`${inputClass} resize-none`}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Article content
              </label>

              <textarea
                rows="14"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article..."
                className={`${inputClass} resize-y font-mono leading-7`}
                required
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="primary-button disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingPostId
                  ? "Update Article"
                  : "Publish Article"}
              </button>

              {editingPostId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="secondary-button"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {message && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          {formError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {formError}
            </div>
          )}
        </section>

        {/* Articles */}
        <section className="mt-12">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
              Published Content
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
              Existing Articles
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No articles yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your published articles will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
                        {post.date
                          ? new Date(post.date).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "No date"}
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-slate-950">
                        {post.title}
                      </h3>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                      Article
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {post.excerpt}
                  </p>

                  <p className="mt-4 text-xs font-medium text-slate-400">
                    /blog/{post.slug}
                  </p>

                  <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
                    <button
                      type="button"
                      onClick={() => startEdit(post)}
                      className="primary-button"
                    >
                      Edit
                    </button>

                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="secondary-button"
                    >
                      View
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(post._id)}
                      disabled={deletingId === post._id}
                      className="secondary-button text-red-600 hover:border-red-200 hover:bg-red-50"
                    >
                      {deletingId === post._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}