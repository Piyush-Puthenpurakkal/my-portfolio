import useSWR from "swr";
import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ProjectsPage() {
  const { data, error } = useSWR("/api/projects", fetcher);

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
          <div className="mx-auto max-w-3xl animate-pulse text-center">
            <div className="mx-auto h-4 w-32 rounded bg-slate-200" />
            <div className="mx-auto mt-5 h-12 max-w-xl rounded bg-slate-200" />
            <div className="mx-auto mt-4 h-5 max-w-2xl rounded bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  const projects = data.projects || [];

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
              Selected Work
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Projects I&apos;ve built.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A selection of applications and software projects built across
              frontend development, backend services, APIs, databases, and
              full-stack systems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                No projects yet
              </h2>

              <p className="mt-3 text-slate-600">
                Projects will appear here once they are added.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id || project.id || project.title}
                  project={project}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}