import connectToDatabase from "../../../lib/mongodb";
import Project from "../../../models/Project";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const projects = await Project.find({});
      res.status(200).json({ projects });
    } catch (error) {
      res.status(500).json({ error: "Error fetching projects" });
    }
  } else if (req.method === "POST") {
    try {
      const project = new Project(req.body);
      await project.save();
      res
        .status(201)
        .json({ message: "Project created successfully", project });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Error creating project" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
