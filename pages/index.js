import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
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
      setHomepageContent({ title: res.data.title, summary: res.data.summary });
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-image.jpg')" }}
    >
      <h1 className="text-5xl font-bold text-white drop-shadow-lg">
        Hi, I&apos;m Piyush Baburaj Puthanpurakkal
      </h1>
      {loadingHomePageContent ? (
        <p className="text-xl text-white mt-4 drop-shadow-lg">
          Loading title...
        </p>
      ) : (
        <p className="text-xl text-white mt-4 drop-shadow-lg">
          {homepageContent.title}
        </p>
      )}
      {loadingHomePageContent ? (
        <p className="text-white mt-4 drop-shadow-lg">Loading summary...</p>
      ) : (
        <p className="text-white mt-4 drop-shadow-lg text-center max-w-2xl">
          {homepageContent.summary}
        </p>
      )}
      <Link
        href="/projects"
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        See My Work
      </Link>
      {resumeExists && (
        <a
          href="/api/resume/download"
          className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition"
          download
        >
          Download Resume
        </a>
      )}
    </motion.div>
  );
}
