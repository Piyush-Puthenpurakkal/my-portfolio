import useSWR from "swr";
import ProjectCard from "../components/ProjectCard";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ProjectsPage() {
  // Fetch projects from the backend API endpoint.
  const { data, error } = useSWR("/api/projects", fetcher);

  if (error) return <div className="p-8">Failed to load projects.</div>;
  if (!data) return <div className="p-8">Loading projects...</div>;

  const projects = data.projects || [];

  if (projects.length === 0) {
    return <div className="p-8">No projects found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
}
