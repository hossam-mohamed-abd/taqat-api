import mongoose from "mongoose";

const sunMainSchma = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Main",
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
    collection: "SubMain",
  }
);
const SubMain = mongoose.model("SubMain", sunMainSchma);
export default SubMain;
