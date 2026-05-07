import mongoose from "mongoose";
import {
  DEFAULT_TASK_USERNAME_COLOR,
  TASK_USERNAME_COLOR_VALUES,
} from "../constants/task.constants.js";

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  submainId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubMain",
  },
  username: {
    type: String,
    trim: true,
  },
  usernameColor: {
    type: String,
    enum: TASK_USERNAME_COLOR_VALUES,
    default: DEFAULT_TASK_USERNAME_COLOR,
  },

  date: {
    type: Date,
  },

  tasks: {
    type: String,
    trim: true,
  },

  remainingWork: {
    type: String,
    trim: true,
  },
  number: {
    type: Number,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
    index: true,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true // optional: adds createdAt and updatedAt automatically
});

TaskSchema.index({ submainId: 1, order: 1 });

const Task = mongoose.model("Task", TaskSchema);
export default Task;