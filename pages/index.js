import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-image.jpg')" }}
    >
      <h1 className="text-5xl font-bold text-white drop-shadow-lg">
        Hi, I&apos;m Piyush Baburaj Puthanpurakkal
      </h1>
      <p className="text-xl text-white mt-4 drop-shadow-lg">
        A Web Developer, Designer, and Creative Thinker.
      </p>
      <Link
        href="/projects"
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        See My Work
      </Link>
    </motion.div>
  );
}
