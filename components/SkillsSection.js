import { motion } from "framer-motion";

const skillGroups = [
  {
    title: "Development",
    icon: "💻",
    skills: [
      "JavaScript",
      "React",
      "Next.js",
      "HTML5",
      "CSS3",
    ],
  },
  {
    title: "Backend & APIs",
    icon: "⚙️",
    skills: [
      "Node.js",
      "Express.js",
      "Python",
      "REST APIs",
      "Django",
      "FastAPI",
    ],
  },
  {
    title: "Databases",
    icon: "🗄️",
    skills: [
      "MongoDB",
      "MySQL",
      "SQL Server",
      "SQL",
    ],
  },
  {
    title: "Tools & Platforms",
    icon: "🛠️",
    skills: [
      "Git",
      "GitHub",
      "Postman",
      "Salesforce",
      "Azure",
    ],
  },
  {
    title: "Enterprise Technologies",
    icon: "🏢",
    skills: [
      "SAP ABAP",
      "ABAP on HANA",
      "OData",
    ],
  },
];

export default function SkillsSection() {
  return (
    <section className="bg-slate-900 py-20 text-white sm:py-24 lg:py-28">
      <div className="page-container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Technical Skills
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Technologies I use to build software.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
            A combination of modern web technologies, backend development,
            databases, enterprise technologies, and tools used throughout my
            development journey.
          </p>
        </motion.div>

        {/* Skill groups */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="rounded-2xl border border-slate-700 bg-slate-800/70 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  {group.icon}
                </div>

                <h3 className="text-xl font-bold">
                  {group.title}
                </h3>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-600 bg-slate-900/60 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-blue-400 hover:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}