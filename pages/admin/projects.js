import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useState } from "react";
import useSWR, { mutate } from "swr";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/admin/projects",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminProjects() {
  const { data, error } = useSWR("/api/projects", fetcher);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [image, setImage] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  const parseTechStack = (str) =>
    str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

  async function handleAddProject(e) {
    e.preventDefault();
    const newProject = {
      title,
      description,
      techStack: parseTechStack(techStack),
      image,
      liveUrl,
      repoUrl,
    };
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });
    if (res.ok) {
      mutate("/api/projects");
      clearForm();
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    const updatedProject = {
      title,
      description,
      techStack: parseTechStack(techStack),
      image,
      liveUrl,
      repoUrl,
    };
    const res = await fetch(`/api/projects/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject),
    });
    if (res.ok) {
      mutate("/api/projects");
      clearForm();
      setEditingId(null);
    }
  }

  function clearForm() {
    setTitle("");
    setDescription("");
    setTechStack("");
    setImage("");
    setLiveUrl("");
    setRepoUrl("");
  }

  const startEdit = (project) => {
    setEditingId(project._id);
    setTitle(project.title);
    setDescription(project.description);
    setTechStack(project.techStack ? project.techStack.join(", ") : "");
    setImage(project.image || "");
    setLiveUrl(project.liveUrl || "");
    setRepoUrl(project.repoUrl || "");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        mutate("/api/projects");
      }
    }
  };

  if (error) return <div className="p-8">Failed to load projects.</div>;
  if (!data) return <div className="p-8">Loading projects...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Projects</h1>
      <form
        onSubmit={editingId ? handleEdit : handleAddProject}
        className="mb-6 space-y-4 border p-4 rounded"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Tech Stack (comma-separated)"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Image URL (from public folder)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Live URL"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Repo URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="border p-2 w-full"
        />
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                clearForm();
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      <ul>
        {data.projects.map((project) => (
          <li key={project._id} className="border p-4 rounded mb-2">
            <h2 className="font-bold">{project.title}</h2>
            <p>{project.description}</p>
            {project.techStack && (
              <p>
                <strong>Tech Stack:</strong> {project.techStack.join(", ")}
              </p>
            )}
            {project.image && (
              <p>
                <strong>Image:</strong> {project.image}
              </p>
            )}
            {project.liveUrl && (
              <p>
                <strong>Live URL:</strong>{" "}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Visit
                </a>
              </p>
            )}
            {project.repoUrl && (
              <p>
                <strong>Repo URL:</strong>{" "}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Code
                </a>
              </p>
            )}
            <div className="mt-2">
              <button
                onClick={() => startEdit(project)}
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
