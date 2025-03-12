import connectToDatabase from "../../../lib/mongodb";
import Accomplishment from "../../../models/Accomplishment";

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const accomplishment = await Accomplishment.findById(id);
      if (!accomplishment)
        return res.status(404).json({ error: "Accomplishment not found" });
      res.status(200).json({ accomplishment });
    } catch (error) {
      res.status(500).json({ error: "Error fetching accomplishment" });
    }
  } else if (req.method === "PUT") {
    try {
      const accomplishment = await Accomplishment.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );
      if (!accomplishment)
        return res.status(404).json({ error: "Accomplishment not found" });
      res
        .status(200)
        .json({ message: "Accomplishment updated", accomplishment });
    } catch (error) {
      res.status(500).json({ error: "Error updating accomplishment" });
    }
  } else if (req.method === "DELETE") {
    try {
      const accomplishment = await Accomplishment.findByIdAndDelete(id);
      if (!accomplishment)
        return res.status(404).json({ error: "Accomplishment not found" });
      res.status(200).json({ message: "Accomplishment deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting accomplishment" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
