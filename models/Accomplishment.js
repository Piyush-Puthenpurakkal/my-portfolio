import mongoose from "mongoose";

const AccomplishmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String },
  date: { type: Date },
  description: { type: String },
  url: { type: String },
});

export default mongoose.models.Accomplishment ||
  mongoose.model("Accomplishment", AccomplishmentSchema);
