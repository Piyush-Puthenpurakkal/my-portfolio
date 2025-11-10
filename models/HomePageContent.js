import mongoose from "mongoose";

const HomePageContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "A Web Developer, Designer, and Creative Thinker.",
    },
    summary: {
      type: String,
      required: true,
      default:
        "This is a placeholder for your personal summary. You can edit this in the admin dashboard.",
    },
  },
  { timestamps: true }
);

export default mongoose.models.HomePageContent ||
  mongoose.model("HomePageContent", HomePageContentSchema);
