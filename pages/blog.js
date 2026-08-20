import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function BlogPage() {
  const { data, error } = useSWR("/api/blogs", fetcher);

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="py-24">
          <div className="page-container">
            <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.3 3.8 2.8 17a2 2 0 0 0 1.74 3h14.92a2 2 0 0 0 1.74-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                  />
                </svg>
              </div>

              <h1 className="mt-6 text-2xl font-bold text-slate-950">
                Unable to load blog posts
              </h1>

              <p className="mt-3 text-slate-600">
                Something went wrong while loading the articles. Please try
                again in a moment.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 py-20 sm:py-24 lg:py-28">
          <div className="page-container">
            <div className="max-w-3xl animate-pulse">
              <div className="h-4 w-32 rounded-full bg-slate-800" />
              <div className="mt-6 h-12 max-w-2xl rounded-xl bg-slate-800" />
              <div className="mt-4 h-12 max-w-xl rounded-xl bg-slate-800" />
              <div className="mt-6 h-5 max-w-2xl rounded bg-slate-800" />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="page-container">
            <div className="grid gap-8 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8"
                >
                  <div className="h-6 w-24 rounded-full bg-slate-200" />
                  <div className="mt-8 h-8 w-3/4 rounded bg-slate-200" />
                  <div className="mt-4 h-5 w-full rounded bg-slate-200" />
                  <div className="mt-3 h-5 w-5/6 rounded bg-slate-200" />
                  <div className="mt-8 h-5 w-28 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  const posts = [...(data.posts || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-950" />

        <div className="page-container relative py-20 sm:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">
              From the Desk
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Thoughts, lessons & things I&apos;ve built.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Technical experiences, development lessons, projects, and ideas
              from my journey as a software developer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          ARTICLES
      ============================================================ */}

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 4.75A2.75 2.75 0 0 1 8.75 2h8.5A2.75 2.75 0 0 1 20 4.75v14.5A2.75 2.75 0 0 1 17.25 22h-8.5A2.75 2.75 0 0 1 6 19.25V4.75Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 7h7m-7 4h7m-7 4h4"
                  />
                </svg>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-950">
                No blog posts yet
              </h2>

              <p className="mt-3 text-slate-600">
                New articles will appear here soon.
              </p>
            </div>
          ) : (
            <>
              {/* Section heading */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Latest Articles
                  </p>

                  <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                    What I&apos;ve been working on.
                  </h2>
                </div>

                <span className="text-sm font-medium text-slate-500">
                  {posts.length} {posts.length === 1 ? "article" : "articles"}
                </span>
              </motion.div>

              {/* Cards */}
              <div className="grid gap-8 md:grid-cols-2">
                {posts.map((post, index) => {
                  const formattedDate = new Date(
                    post.date
                  ).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <motion.article
                      key={post._id || post.slug}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.06,
                      }}
                      whileHover={{ y: -6 }}
                      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl"
                    >
                      {/* Accent line */}
                      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                      <Link
                        href={`/blog/${encodeURIComponent(post.slug)}`}
                        className="flex h-full flex-col p-7 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 sm:p-8"
                      >
                        {/* Metadata */}
                        <div className="flex items-center justify-between gap-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                            {formattedDate}
                          </span>

                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Article
                          </span>
                        </div>

                        {/* Article body */}
                        <div className="mt-8 flex flex-1 flex-col">
                          <h3 className="text-2xl font-bold leading-tight tracking-tight text-slate-950 transition-colors duration-200 group-hover:text-blue-700 sm:text-3xl">
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className="mt-5 flex-1 text-base leading-7 text-slate-600">
                              {post.excerpt}
                            </p>
                          )}

                          {/* CTA */}
                          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                            <span className="text-sm font-semibold text-blue-700">
                              Read Article
                            </span>

                            <span
                              aria-hidden="true"
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 10a.75.75 0 0 1 .75-.75h10.69L11.22 6.03a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06 1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}