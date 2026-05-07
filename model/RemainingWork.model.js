import mongoose from "mongoose";

const RemainingWorkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubMain",
      required: true,
      index: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "remainingWork",
  }
);

RemainingWorkSchema.index({ submainId: 1, order: 1 });

const RemainingWork = mongoose.model("RemainingWork", RemainingWorkSchema);
export default RemainingWork;
