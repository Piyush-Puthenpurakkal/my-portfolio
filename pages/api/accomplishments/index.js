import connectToDatabase from "../../../lib/mongodb";
import Accomplishment from "../../../models/Accomplishment";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const accomplishments = await Accomplishment.find({});
      res.status(200).json({ accomplishments });
    } catch (error) {
      res.status(500).json({ error: "Error fetching accomplishments" });
    }
  } else if (req.method === "POST") {
    try {
      const accomplishment = new Accomplishment(req.body);
      await accomplishment.save();
      res
        .status(201)
        .json({
          message: "Accomplishment created successfully",
          accomplishment,
        });
    } catch (error) {
      res.status(500).json({ error: "Error creating accomplishment" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
