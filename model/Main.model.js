import mongoose from "mongoose";

const mainSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    
  },
  {
    timestamps: true,
    collection: "main",
  }
);
const Main = mongoose.model("Main", mainSchema);
export default Main;