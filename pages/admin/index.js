import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/admin",
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

function DashboardCard({ title, value, description, href, icon }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          {icon}
        </div>

        <span className="text-slate-300 transition-colors group-hover:text-blue-500">
          →
        </span>
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard({ session }) {
  const { data: clientSession, status } = useSession();

  const {
    data: projectsData,
    error: projectsError,
  } = useSWR("/api/projects", fetcher);

  const {
    data: blogsData,
    error: blogsError,
  } = useSWR("/api/blogs", fetcher);

  const {
    data: accomplishmentsData,
    error: accomplishmentsError,
  } = useSWR("/api/accomplishments", fetcher);

  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeExists, setResumeExists] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [homepageContent, setHomepageContent] = useState({
    title: "",
    summary: "",
  });

  const [loadingHomePageContent, setLoadingHomePageContent] = useState(true);
  const [savingTitle, setSavingTitle] = useState(false);
  const [savingSummary, setSavingSummary] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkResumeStatus();
    fetchHomePageContent();
  }, []);

  const fetchHomePageContent = async () => {
    setLoadingHomePageContent(true);

    try {
      const res = await axios.get("/api/homepage-content");

      setHomepageContent({
        title: res.data.title,
        summary: res.data.summary,
      });
    } catch (err) {
      console.error("Error fetching homepage content:", err);
      setError("Error fetching homepage content.");
    } finally {
      setLoadingHomePageContent(false);
    }
  };

  const checkResumeStatus = async () => {
    try {
      const res = await axios.head("/api/resume/download");
      setResumeExists(res.status === 200);
    } catch (err) {
      setResumeExists(false);
    }
  };

  const handleTitleChange = (event) => {
    setHomepageContent((prev) => ({
      ...prev,
      title: event.target.value,
    }));

    setMessage("");
    setError("");
  };

  const handleSummaryChange = (event) => {
    setHomepageContent((prev) => ({
      ...prev,
      summary: event.target.value,
    }));

    setMessage("");
    setError("");
  };

  const handleSaveTitle = async () => {
    setSavingTitle(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.put(
        "/api/homepage-content",
        { title: homepageContent.title },
        { withCredentials: true }
      );

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error saving title.");
    } finally {
      setSavingTitle(false);
    }
  };

  const handleSaveSummary = async () => {
    setSavingSummary(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.put(
        "/api/homepage-content",
        { summary: homepageContent.summary },
        { withCredentials: true }
      );

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error saving summary.");
    } finally {
      setSavingSummary(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0] || null);
    setMessage("");
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res = await axios.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setMessage(res.data.message);
      setSelectedFile(null);
      checkResumeStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!resumeExists) return;

    if (!confirm("Are you sure you want to remove the current resume?")) {
      return;
    }

    setRemoving(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.delete("/api/resume/remove", {
        withCredentials: true,
      });

      setMessage(res.data.message);
      checkResumeStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Error removing resume.");
    } finally {
      setRemoving(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="page-container py-24 text-center">
          <p className="text-sm font-medium text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  const user = clientSession?.user || session?.user;

  const projectCount = projectsError
    ? "—"
    : projectsData?.projects?.length ?? "—";

  const blogCount = blogsError ? "—" : blogsData?.posts?.length ?? "—";

  const accomplishmentCount = accomplishmentsError
    ? "—"
    : accomplishmentsData?.accomplishments?.length ?? "—";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-slate-950 to-slate-950" />

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="page-container relative py-14 sm:py-16">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Control Center
              </p>

              <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Admin Dashboard
              </h1>

              <p className="mt-4 text-slate-300">
                Welcome back, {user?.name || "Admin"}.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              View Portfolio
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="page-container py-12 sm:py-16">
        {/* ===================================================
            OVERVIEW
        ==================================================== */}

        <SectionHeading
          eyebrow="Overview"
          title="Your portfolio at a glance."
          description="Manage the content visitors see across your portfolio."
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Projects"
            value={projectCount}
            description="Manage your software projects."
            href="/admin/projects"
            icon={<span className="text-xl">🚀</span>}
          />

          <DashboardCard
            title="Articles"
            value={blogCount}
            description="Write and manage blog posts."
            href="/admin/blogs"
            icon={<span className="text-xl">✍️</span>}
          />

          <DashboardCard
            title="Accomplishments"
            value={accomplishmentCount}
            description="Manage certificates and achievements."
            href="/admin/accomplishments"
            icon={<span className="text-xl">🏆</span>}
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              📄
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
              Resume
            </p>

            <p className="mt-2 text-xl font-extrabold text-slate-950">
              {resumeExists ? "Available" : "Not uploaded"}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage the resume shown on your portfolio.
            </p>
          </div>
        </div>

        {/* ===================================================
            QUICK ACTIONS
        ==================================================== */}

        <section className="mt-14">
          <SectionHeading
            eyebrow="Quick Actions"
            title="Jump straight into content."
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/admin/projects"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <span className="text-blue-600">+</span> Add or edit projects
            </Link>

            <Link
              href="/admin/blogs"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <span className="text-blue-600">+</span> Write an article
            </Link>

            <Link
              href="/admin/accomplishments"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <span className="text-blue-600">+</span> Add accomplishment
            </Link>
          </div>
        </section>

        {/* ===================================================
            HOMEPAGE CONTENT
        ==================================================== */}

        <section className="mt-14">
          <SectionHeading
            eyebrow="Homepage"
            title="Control your introduction."
            description="These fields power the editable homepage content."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Title */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="text-sm font-semibold text-slate-900">
                Homepage Title
              </label>

              {loadingHomePageContent ? (
                <div className="mt-3 h-12 animate-pulse rounded-xl bg-slate-100" />
              ) : (
                <input
                  type="text"
                  value={homepageContent.title}
                  onChange={handleTitleChange}
                  className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              )}

              <button
                onClick={handleSaveTitle}
                disabled={savingTitle || loadingHomePageContent}
                className="primary-button mt-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingTitle ? "Saving..." : "Save Title"}
              </button>
            </div>

            {/* Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="text-sm font-semibold text-slate-900">
                Homepage Summary
              </label>

              {loadingHomePageContent ? (
                <div className="mt-3 h-32 animate-pulse rounded-xl bg-slate-100" />
              ) : (
                <textarea
                  rows="5"
                  value={homepageContent.summary}
                  onChange={handleSummaryChange}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              )}

              <button
                onClick={handleSaveSummary}
                disabled={savingSummary || loadingHomePageContent}
                className="primary-button mt-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingSummary ? "Saving..." : "Save Summary"}
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================
            RESUME
        ==================================================== */}

        <section className="mt-14">
          <SectionHeading
            eyebrow="Resume"
            title="Keep your resume current."
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      resumeExists ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />

                  <p className="font-semibold text-slate-900">
                    {resumeExists
                      ? "Resume is currently available"
                      : "No resume uploaded"}
                  </p>
                </div>

                {resumeExists && (
                  <a
                    href="/api/resume/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    View current resume →
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="block max-w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                />

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="primary-button disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>

                <button
                  onClick={handleRemove}
                  disabled={!resumeExists || removing}
                  className="secondary-button disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {removing ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            FEEDBACK
        ==================================================== */}

        {(message || error) && (
          <div className="mt-8">
            {message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}