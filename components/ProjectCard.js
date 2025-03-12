import { motion } from "framer-motion";
import Image from "next/image";

export default function ProjectCard({ project }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-lg p-4"
    >
      <Image
        src={project.image}
        alt={project.title}
        width={500}
        height={300}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h2 className="text-xl font-bold mt-2">{project.title}</h2>
      <p className="text-gray-600">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech, index) => (
          <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-4 flex space-x-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Live Demo
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Code
          </a>
        )}
      </div>
    </motion.div>
  );
}
