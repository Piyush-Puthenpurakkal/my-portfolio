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
        destination: "/auth/signin?callbackUrl=/admin/accomplishments",
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

export default function AdminAccomplishments() {
  const { data, error } = useSWR("/api/accomplishments", fetcher);

  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  function clearForm() {
    setTitle("");
    setIssuer("");
    setDate("");
    setDescription("");
    setUrl("");
    setEditingId(null);
    setMessage("");
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setFormError("");

    const accomplishment = {
      title: title.trim(),
      issuer: issuer.trim(),
      date,
      description: description.trim(),
      url: url.trim(),
    };

    try {
      const response = await fetch(
        editingId
          ? `/api/accomplishments/${editingId}`
          : "/api/accomplishments",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accomplishment),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save accomplishment.");
      }

      await mutate("/api/accomplishments");

      clearForm();

      setMessage(
        editingId
          ? "Accomplishment updated successfully."
          : "Accomplishment added successfully."
      );
    } catch (err) {
      setFormError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(acc) {
    setEditingId(acc._id);
    setTitle(acc.title || "");
    setIssuer(acc.issuer || "");
    setDate(acc.date ? acc.date.substring(0, 10) : "");
    setDescription(acc.description || "");
    setUrl(acc.url || "");

    setMessage("");
    setFormError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this accomplishment?")) {
      return;
    }

    setDeletingId(id);
    setMessage("");
    setFormError("");

    try {
      const response = await fetch(`/api/accomplishments/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to delete accomplishment."
        );
      }

      await mutate("/api/accomplishments");

      setMessage("Accomplishment deleted successfully.");
    } catch (err) {
      setFormError(err.message || "Unable to delete accomplishment.");
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
              Unable to load accomplishments
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
            Loading accomplishments...
          </p>
        </div>
      </main>
    );
  }

  const accomplishments = data.accomplishments || [];

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
                Accomplishments
              </h1>

              <p className="mt-3 text-slate-300">
                Manage certificates, achievements, and credentials.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
              {accomplishments.length}{" "}
              {accomplishments.length === 1
                ? "accomplishment"
                : "accomplishments"}
            </span>
          </div>
        </div>
      </section>

      <div className="page-container py-10 sm:py-14">
        {/* Form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
              {editingId ? "Editing Accomplishment" : "New Accomplishment"}
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
              {editingId
                ? "Update accomplishment"
                : "Add an accomplishment"}
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
                  placeholder="e.g. Microsoft Azure Fundamentals"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Issuer
                </label>

                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Microsoft"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Verification URL
                </label>

                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
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
                placeholder="Describe the accomplishment..."
                className={`${inputClass} resize-none`}
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
                  : editingId
                  ? "Update Accomplishment"
                  : "Add Accomplishment"}
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

        {/* List */}
        <section className="mt-12">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
              Portfolio
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
              Existing Accomplishments
            </h2>
          </div>

          {accomplishments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No accomplishments yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add your first accomplishment using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {accomplishments.map((acc) => (
                <article
                  key={acc._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      🏆
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-slate-950">
                        {acc.title}
                      </h3>

                      {acc.issuer && (
                        <p className="mt-1 text-sm font-medium text-blue-700">
                          {acc.issuer}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {acc.date && (
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {new Date(acc.date).toLocaleDateString(undefined, {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}

                    <p className="text-sm leading-6 text-slate-600">
                      {acc.description}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                    {acc.url && (
                      <a
                        href={acc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="secondary-button"
                      >
                        Verify ↗
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => startEdit(acc)}
                      className="primary-button"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(acc._id)}
                      disabled={deletingId === acc._id}
                      className="secondary-button text-red-600 hover:border-red-200 hover:bg-red-50"
                    >
                      {deletingId === acc._id ? "Deleting..." : "Delete"}
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