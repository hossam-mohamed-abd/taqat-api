import mongoose from "mongoose";

const deadlineSchema = new mongoose.Schema(
  {
    submainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubMain",
      required: true,
    },
    date: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "Deadline",
  }
);

const Deadline = mongoose.model("Deadline", deadlineSchema);
export default Deadline;
