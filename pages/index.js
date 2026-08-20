import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import SkillsSection from "../components/SkillsSection";
import axios from "axios";

export default function Home() {
  const [resumeExists, setResumeExists] = useState(false);

  const [homepageContent, setHomepageContent] = useState({
    title: "",
    summary: "",
  });

  const [loadingHomePageContent, setLoadingHomePageContent] = useState(true);

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

  return (
    <>
      {/* =========================================================
          HERO SECTION
      ========================================================= */}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden bg-slate-950"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-image.jpg')" }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-950/60" />

        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-950/20" />

        {/* Content */}
        <div className="page-container relative z-10 py-20 sm:py-24 lg:py-28">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300 sm:text-base"
            >
              Software Developer
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              Hi, I&apos;m Piyush
              <span className="block text-blue-300">
                Baburaj Puthanpurakkal
              </span>
            </motion.h1>

            {loadingHomePageContent ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 max-w-2xl text-lg text-slate-200 sm:text-xl"
              >
                Loading...
              </motion.p>
            ) : (
              <>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 max-w-2xl text-xl font-medium leading-8 text-white sm:text-2xl"
                >
                  {homepageContent.title}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg"
                >
                  {homepageContent.summary}
                </motion.p>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/projects" className="primary-button">
                View My Work
              </Link>

              {resumeExists && (
                <a
                  href="/api/resume/download"
                  className="secondary-button"
                  download
                >
                  Download Resume
                </a>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
      </motion.section>

      {/* =========================================================
          ABOUT SECTION
      ========================================================= */}

      <section className="bg-slate-50 py-20 sm:py-24 lg:py-28">
        <div className="page-container">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              About Me
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Building practical software that solves real problems.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              I&apos;m a software developer with experience across full-stack
              application development, backend services, APIs, and technical
              support. I enjoy turning ideas into reliable, user-friendly
              applications.
            </p>
          </motion.div>

          {/* About cards */}
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {/* About me card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-9"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                👨‍💻
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                A little about me
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                My development journey has taken me through enterprise
                application development, full-stack web development, and
                production support. This has helped me understand not only how
                to build software, but also how to troubleshoot, maintain, and
                improve it.
              </p>

              <p className="mt-4 leading-7 text-slate-600">
                I&apos;m particularly interested in backend development,
                RESTful APIs, Python, JavaScript, and building applications
                that are clean, maintainable, and useful.
              </p>
            </motion.div>

            {/* What I do card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-9"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                ⚡
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                What I work with
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <h4 className="font-semibold text-slate-900">
                    Full-Stack Development
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Building complete web applications from frontend to
                    backend.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <h4 className="font-semibold text-slate-900">
                    Backend & APIs
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Designing REST APIs and backend services.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <h4 className="font-semibold text-slate-900">
                    Python Development
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Developing backend applications and services with Python.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <h4 className="font-semibold text-slate-900">
                    Problem Solving
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Debugging, troubleshooting, and improving applications.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Technology strip */}
          {/* <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mt-10 rounded-2xl bg-slate-900 p-7 sm:p-9"
          >
            <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              Technologies I work with
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                "JavaScript",
                "React",
                "Next.js",
                "Node.js",
                "Express.js",
                "Python",
                "REST APIs",
                "MongoDB",
                "MySQL",
                "SQL",
                "Git",
                "Postman",
              ].map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-blue-400 hover:text-blue-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          </motion.div> */}
        </div>
      </section>

      <SkillsSection />
    </>
  );
}