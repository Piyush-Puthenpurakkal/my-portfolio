import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const { data, error } = useSWR(
    slug ? `/api/blogs?slug=${encodeURIComponent(slug)}` : null,
    fetcher
  );

  // ============================================================
  // LOADING
  // ============================================================

  if (!router.isReady || !data) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 py-24">
          <div className="page-container">
            <div className="mx-auto max-w-4xl animate-pulse">
              <div className="h-4 w-28 rounded bg-slate-800" />
              <div className="mt-8 h-12 w-3/4 rounded bg-slate-800" />
              <div className="mt-4 h-12 w-1/2 rounded bg-slate-800" />
              <div className="mt-8 h-4 w-40 rounded bg-slate-800" />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="page-container">
            <div className="mx-auto max-w-3xl animate-pulse">
              <div className="h-5 w-full rounded bg-slate-200" />
              <div className="mt-4 h-5 w-5/6 rounded bg-slate-200" />
              <div className="mt-4 h-5 w-full rounded bg-slate-200" />
              <div className="mt-10 h-5 w-full rounded bg-slate-200" />
              <div className="mt-4 h-5 w-4/5 rounded bg-slate-200" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ============================================================
  // ERROR / NOT FOUND
  // ============================================================

  if (error || !data.post) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 py-24 text-white">
          <div className="page-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Article
              </p>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Article not found
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-400">
                The article you&apos;re looking for doesn&apos;t exist or may
                have been removed.
              </p>

              <Link
                href="/blog"
                className="primary-button mt-8 inline-flex"
              >
                Back to Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const post = data.post;

  const formattedDate = new Date(post.date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ========================================================
          ARTICLE HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="page-container relative py-20 sm:py-24 lg:py-28">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >

            {/* Back */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition-colors hover:text-blue-200"
            >
              <span aria-hidden="true">←</span>
              Back to Blog
            </Link>

            {/* Label */}
            <p className="mt-12 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              Article
            </p>

            {/* Title */}
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              {post.title}
            </h1>

            {/* Date */}
            <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span>{formattedDate}</span>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
                {post.excerpt}
              </p>
            )}

          </motion.div>
        </div>
      </section>

      {/* ========================================================
          ARTICLE CONTENT
      ========================================================= */}

      <section className="py-14 sm:py-20 lg:py-24">
        <div className="page-container">

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-3xl"
          >

            {/* Content card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:p-12">

              <div className="whitespace-pre-line text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
                {post.content}
              </div>

            </div>

            {/* Bottom navigation */}
            <div className="mt-10 border-t border-slate-200 pt-8">

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900"
              >
                <span aria-hidden="true">←</span>
                All Articles
              </Link>

            </div>

          </motion.article>

        </div>
      </section>

    </main>
  );
}