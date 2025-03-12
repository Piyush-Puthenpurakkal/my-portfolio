// pages/api/projects/[id].js
import connectToDatabase from "../../../lib/mongodb";
import Project from "../../../models/Project";

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const project = await Project.findById(id);
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.status(200).json({ project });
    } catch (error) {
      res.status(500).json({ error: "Error fetching project" });
    }
  } else if (req.method === "PUT") {
    try {
      const project = await Project.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.status(200).json({ message: "Project updated", project });
    } catch (error) {
      res.status(500).json({ error: "Error updating project" });
    }
  } else if (req.method === "DELETE") {
    try {
      const project = await Project.findByIdAndDelete(id);
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.status(200).json({ message: "Project deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting project" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
