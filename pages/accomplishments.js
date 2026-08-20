import useSWR from "swr";
import { motion } from "framer-motion";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AccomplishmentsPage() {
  const { data, error } = useSWR("/api/accomplishments", fetcher);

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
        <div className="page-container py-24">
          <div className="mx-auto max-w-3xl animate-pulse text-center">
            <div className="mx-auto h-4 w-32 rounded bg-slate-200" />
            <div className="mx-auto mt-5 h-12 max-w-xl rounded bg-slate-200" />
            <div className="mx-auto mt-4 h-5 max-w-2xl rounded bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  const accomplishments = data.accomplishments || [];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-slate-950 to-slate-950" />

        <div className="page-container relative">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Credentials & Milestones
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Learning that moves me forward.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Certifications, training, and accomplishments that reflect my
              continuous learning and development as a software professional.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Accomplishments */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          {accomplishments.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                No accomplishments yet
              </h2>

              <p className="mt-3 text-slate-600">
                Accomplishments will appear here once they are added.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {accomplishments.map((item, index) => (
                <motion.article
                  key={item._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{ y: -6 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:p-8"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.7 14.7-1.2 6.1L12 18l4.5 2.8-1.2-6.1"
                        />
                      </svg>
                    </div>

                    {item.date && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {new Date(item.date).toLocaleDateString(undefined, {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mt-6 flex flex-1 flex-col">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      {item.title}
                    </h2>

                    {item.issuer && (
                      <p className="mt-2 text-sm font-semibold text-blue-700">
                        {item.issuer}
                      </p>
                    )}

                    <p className="mt-4 flex-1 text-sm leading-7 text-slate-600 sm:text-base">
                      {item.description}
                    </p>

                    {/* Verification */}
                    {item.url && (
                      <div className="mt-7">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                        >
                          Verify Certificate
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 10a.75.75 0 0 1 .75-.75h10.69L11.22 6.03a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}