import { motion } from "framer-motion";
import Image from "next/image";

export default function ProjectCard({ project }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl"
    >
      {/* =====================================================
          PROJECT PREVIEW
      ====================================================== */}
      <div className="relative h-56 overflow-hidden bg-slate-900">
        {/* Existing image — fallback / base layer */}
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}

        {/* Live project preview */}
        {project.liveUrl && (
          <div className="absolute inset-0 z-10 overflow-hidden bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <iframe
              src={project.liveUrl}
              title={`${project.title} live preview`}
              className="h-full w-full border-0"
              loading="lazy"
              tabIndex="-1"
            />

            {/* Preview label */}
            <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              Live Preview
            </div>
          </div>
        )}

        {/* Dark overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

        {/* Preview hint */}
        {project.liveUrl && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-30 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            Hover to preview
          </div>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {project.title}
        </h2>

        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 sm:text-base">
          {project.description}
        </p>

        {/* Technology stack */}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack?.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-7 flex items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button"
            >
              Live Demo
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button"
            >
              View Code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}