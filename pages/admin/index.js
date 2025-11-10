import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/admin",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}

export default function AdminDashboard({ session }) {
  const { data: clientSession, status } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeExists, setResumeExists] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [homepageContent, setHomepageContent] = useState({
    title: "",
    summary: "",
  });
  const [loadingHomePageContent, setLoadingHomePageContent] = useState(true);
  const [savingHomePageContent, setSavingHomePageContent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      setError("Error fetching homepage content.");
    } finally {
      setLoadingHomePageContent(false);
    }
  };

  const handleTitleChange = (event) => {
    setHomepageContent((prev) => ({ ...prev, title: event.target.value }));
    setMessage("");
    setError("");
  };

  const handleSummaryChange = (event) => {
    setHomepageContent((prev) => ({ ...prev, summary: event.target.value }));
    setMessage("");
    setError("");
  };

  const handleSaveHomePageContent = async () => {
    setSavingHomePageContent(true);
    setMessage("");
    setError("");
    try {
      const res = await axios.put("/api/homepage-content", homepageContent, {
        withCredentials: true,
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error saving homepage content.");
    } finally {
      setSavingHomePageContent(false);
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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res = await axios.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setMessage(res.data.message);
      setSelectedFile(null);
      checkResumeStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.delete("/api/resume/remove", {
        withCredentials: true,
      });
      setMessage(res.data.message);
      checkResumeStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Error removing resume.");
    } finally {
      setRemoving(false);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  const user = clientSession?.user || session?.user;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <ul className="mt-4">
        <li>
          <Link
            href="/admin/projects"
            className="text-blue-500 hover:underline"
          >
            Manage Projects
          </Link>
        </li>
        <li>
          <Link href="/admin/blogs" className="text-blue-500 hover:underline">
            Manage Blog Posts
          </Link>
        </li>
        <li>
          <Link
            href="/admin/accomplishments"
            className="text-blue-500 hover:underline"
          >
            Manage Accomplishments
          </Link>
        </li>
      </ul>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Resume Management</h2>
        {resumeExists ? (
          <p className="mb-2">
            Current Resume:{" "}
            <a
              href="/resume/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Resume
            </a>
          </p>
        ) : (
          <p className="mb-2">No resume uploaded.</p>
        )}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mb-4 block"
        />
        <div className="flex space-x-2">
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!selectedFile}
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
          <button
            onClick={handleRemove}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={!resumeExists || removing}
          >
            {removing ? "Removing..." : "Remove Resume"}
          </button>
        </div>
        {message && <p className="mt-2 text-green-600">{message}</p>}
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Title Management</h2>
        {loadingHomePageContent ? (
          <p>Loading title...</p>
        ) : (
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={homepageContent.title}
            onChange={handleTitleChange}
          />
        )}
        <button
          onClick={handleSaveHomePageContent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={savingHomePageContent || loadingHomePageContent}
        >
          {savingHomePageContent ? "Saving..." : "Save Title"}
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Summary Management</h2>
        {loadingHomePageContent ? (
          <p>Loading summary...</p>
        ) : (
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            rows="6"
            value={homepageContent.summary}
            onChange={handleSummaryChange}
          ></textarea>
        )}
        <button
          onClick={handleSaveHomePageContent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={savingHomePageContent || loadingHomePageContent}
        >
          {savingHomePageContent ? "Saving..." : "Save Summary"}
        </button>
      </div>
    </div>
  );
}
