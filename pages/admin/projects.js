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
        destination: "/auth/signin?callbackUrl=/admin/projects",
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

export default function AdminProjects() {
  const { data, error } = useSWR("/api/projects", fetcher);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [image, setImage] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  const parseTechStack = (str) =>
    str
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  function clearForm() {
    setTitle("");
    setDescription("");
    setTechStack("");
    setImage("");
    setLiveUrl("");
    setRepoUrl("");
    setEditingId(null);
    setMessage("");
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setFormError("");

    const project = {
      title: title.trim(),
      description: description.trim(),
      techStack: parseTechStack(techStack),
      image: image.trim(),
      liveUrl: liveUrl.trim(),
      repoUrl: repoUrl.trim(),
    };

    try {
      const response = await fetch(
        editingId ? `/api/projects/${editingId}` : "/api/projects",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(project),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save project.");
      }

      const successMessage = editingId
  ? "Project updated successfully."
  : "Project created successfully.";

await mutate("/api/projects");

clearForm();
setMessage(successMessage);
    } catch (err) {
      setFormError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(project) {
    setEditingId(project._id);
    setTitle(project.title || "");
    setDescription(project.description || "");
    setTechStack(project.techStack?.join(", ") || "");
    setImage(project.image || "");
    setLiveUrl(project.liveUrl || "");
    setRepoUrl(project.repoUrl || "");

    setMessage("");
    setFormError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setDeletingId(id);
    setMessage("");
    setFormError("");

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete project.");
      }

      await mutate("/api/projects");
      setMessage("Project deleted successfully.");
    } catch (err) {
      setFormError(err.message || "Unable to delete project.");
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
              Unable to load projects
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
        <div className="page-container py-24">
          <p className="text-center text-sm font-medium text-slate-500">
            Loading projects...
          </p>
        </div>
      </main>
    );
  }

  const projects = data.projects || [];

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
                Projects
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Manage the projects displayed on your portfolio.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
              {projects.length}{" "}
              {projects.length === 1 ? "project" : "projects"}
            </span>
          </div>
        </div>
      </section>

      <div className="page-container py-10 sm:py-14">
        {/* Form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
                {editingId ? "Editing Project" : "New Project"}
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
                {editingId ? "Update project details" : "Add a project"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                Cancel editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Project title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Spark Link Manager"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Technologies
                </label>

                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Separate technologies with commas.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Description
              </label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you built, the problem it solves, and what makes it interesting."
                className={`${inputClass} resize-none`}
                required
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Live Demo URL
                </label>

                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://your-project.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Repository URL
                </label>

                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Fallback image
                </label>

                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/project-image.jpg"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Optional. The live URL powers the public hover preview.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="primary-button disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Project"
                  : "Add Project"}
              </button>

              {editingId && (
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

        {/* Project list */}
        <section className="mt-12">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
              Portfolio
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
              Existing Projects
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No projects yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add your first project using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="border-b border-slate-100 bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-950">
                          {project.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                          {project.description}
                        </p>
                      </div>

                      {project.liveUrl && (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Live
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 grid gap-2 text-sm">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-700 hover:text-blue-900"
                        >
                          Open Live Demo ↗
                        </a>
                      )}

                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-600 hover:text-slate-900"
                        >
                          Open Repository ↗
                        </a>
                      )}
                    </div>

                    <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
                      <button
                        type="button"
                        onClick={() => startEdit(project)}
                        className="primary-button"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(project._id)}
                        disabled={deletingId === project._id}
                        className="secondary-button text-red-600 hover:border-red-200 hover:bg-red-50"
                      >
                        {deletingId === project._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
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