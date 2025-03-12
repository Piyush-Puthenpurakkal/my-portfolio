import connectToDatabase from "../../lib/mongodb";
import ContactMessage from "../../models/ContactMessage";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const message = new ContactMessage(req.body);
      await message.save();
      res
        .status(201)
        .json({ message: "Message received", messageData: message });
    } catch (error) {
      res.status(500).json({ error: "Error saving contact message" });
    }
  } else if (req.method === "GET") {
    try {
      const messages = await ContactMessage.find({});
      res.status(200).json({ messages });
    } catch (error) {
      res.status(500).json({ error: "Error fetching contact messages" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
