import Task from "../model/Task.model.js";
import XLSX from "xlsx";
import { Readable } from "stream";
import SubMain from "../model/SubMain.model.js";
import Main from "../model/Main.model.js";
import {
  DEFAULT_TASK_USERNAME_COLOR,
  TASK_USERNAME_COLOR_ALIASES,
  TASK_USERNAME_COLOR_VALUES,
} from "../constants/task.constants.js";

const resolveUsernameColor = (value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  return TASK_USERNAME_COLOR_ALIASES[normalized];
};

const normalizeOrderForSubMain = async (submainId) => {
  const tasks = await Task.find({ submainId })
    .sort({ order: 1, createdAt: 1, _id: 1 })
    .select("_id order");

  if (!tasks.length) {
    return [];
  }

  const hasOrderMismatch = tasks.some((task, index) => task.order !== index + 1);
  if (!hasOrderMismatch) {
    return tasks;
  }

  const bulkOps = tasks.map((task, index) => ({
    updateOne: {
      filter: { _id: task._id },
      update: { $set: { order: index + 1 } },
    },
  }));

  await Task.bulkWrite(bulkOps);

  return Task.find({ submainId }).sort({ order: 1, createdAt: 1, _id: 1 });
};

const getNextOrderForSubMain = async (submainId) => {
  const lastTask = await Task.findOne({ submainId })
    .sort({ order: -1, createdAt: -1, _id: -1 })
    .select("order");

  if (!lastTask) {
    return 1;
  }

  const order = Number(lastTask.order);
  if (!Number.isFinite(order) || order < 1) {
    const count = await Task.countDocuments({ submainId });
    return count + 1;
  }

  return order + 1;
};

export const createTask = async (req, res) => {
  try {
    const task = req.body;
    const userId = req._id;

    const submain = await SubMain.findById({ _id: task.submainId });
    if (!submain)
      return res
        .status(404)
        .json({ message: `No Sub Main Website With This ID : ${task.submainId}` });

    const { order, usernameColor, ...taskPayload } = task;
    const nextOrder = await getNextOrderForSubMain(task.submainId);
    const normalizedUsernameColor =
      resolveUsernameColor(usernameColor) || DEFAULT_TASK_USERNAME_COLOR;

    const newtask = new Task({
      ...taskPayload,
      userId: userId,
      order: nextOrder,
      usernameColor: normalizedUsernameColor,
    });
    const savedtask = await newtask.save();
    res.status(201).json({
      message: "Task created successfully",
      task: savedtask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ submainId: 1, order: 1, createdAt: 1 });
    if (tasks.length == 0)
      return res.status(404).json({ message: `No Tasks Available !` });

    res.status(200).json({
      message: "Tasks Is Available",
      total: tasks.length,
      tasks: tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getTaskByID = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task)
      return res.status(404).json({ message: `This Task Is Not Available` });

    res.status(200).json({
      message: `This Task Is Available`,
      task: task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const newtask = req.body;
    const data = await Task.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Task is not available" });
    }

    const previousSubmainId = data.submainId ? String(data.submainId) : "";

    if (newtask.submainId !== undefined) {
      data.submainId = newtask.submainId || data.submainId;
    }
    if (newtask.username !== undefined) {
      data.username = newtask.username;
    }
    if (newtask.usernameColor !== undefined) {
      const normalizedUsernameColor = resolveUsernameColor(newtask.usernameColor);
      if (!normalizedUsernameColor) {
        return res.status(400).json({
          message: `usernameColor must be one of: ${TASK_USERNAME_COLOR_VALUES.join(", ")}`,
        });
      }
      data.usernameColor = normalizedUsernameColor;
    }
    if (newtask.date !== undefined) {
      data.date = newtask.date;
    }
    if (newtask.tasks !== undefined) {
      data.tasks = newtask.tasks;
    }
    if (newtask.remainingWork !== undefined) {
      data.remainingWork = newtask.remainingWork;
    }
    if (newtask.number !== undefined) {
      data.number = newtask.number;
    }
    if (newtask.notes !== undefined) {
      data.notes = newtask.notes;
    }
    if (newtask.order !== undefined) {
      data.order = Number(newtask.order);
    }

    await data.save();

    const currentSubmainId = data.submainId ? String(data.submainId) : "";
    if (previousSubmainId && previousSubmainId !== currentSubmainId) {
      await normalizeOrderForSubMain(previousSubmainId);
    }
    if (currentSubmainId) {
      await normalizeOrderForSubMain(currentSubmainId);
    }

    res.status(200).json({
      message: "task updated successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteTaskByID = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task)
      return res.status(404).json({ message: `This Task Is Not Available !` });

    if (task.submainId) {
      await normalizeOrderForSubMain(task.submainId);
    }

    res.status(200).json({
      message: `Task Is Available`,
      deletedTask: task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getTasksBySubMainId = async (req, res) => {
  try {
    const { id } = req.params;
    let tasks = await Task.find({ submainId: id }).sort({ order: 1, createdAt: 1, _id: 1 });

    if (tasks.length === 0) {
      return res.status(200).json({
        message: "Tasks retrieved successfully",
        tasks: [],
      });
    }

    const hasInvalidOrder = tasks.some((task, index) => task.order !== index + 1);
    if (hasInvalidOrder) {
      tasks = await normalizeOrderForSubMain(id);
    }

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}





export const printTasks = async (req, res) => {
  try {
    const { subMainId } = req.params;
    console.log(`Generating Excel for SubMain ID: ${subMainId}`);

    // Fetch tasks filtered by submainId, no population
    const tasks = await Task.find({ submainId: subMainId })
      .sort({ order: 1, createdAt: 1, _id: 1 })
      .lean();

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this SubMain ID" });
    }

    // Map data to export only relevant fields from Tasks model
    const data = tasks.map((task) => ({
      "التسلسل": task.order || "",
      "اسم الموظف": task.username || "",
      "لون اسم الموظف": task.usernameColor || DEFAULT_TASK_USERNAME_COLOR,
      التاريخ: task.date ? new Date(task.date).toLocaleDateString("ar-EG") : "",
      المهام: task.tasks || "",
      "العمل المتبقي": task.remainingWork || "",
      الملاحظات: task.notes || "",
      الرقم: task.number !== undefined ? task.number : "",
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    // Write workbook to buffer
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename="tasks.xlsx"');
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Length", buffer.length);

    // Stream the buffer
    const readable = Readable.from(buffer);
    readable.pipe(res);

    console.log("Excel file generated and sent successfully");
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const reorderTasks = async (req, res) => {
  try {
    const { submainId } = req.params;
    const { orderedTaskIds } = req.body;

    if (!Array.isArray(orderedTaskIds) || orderedTaskIds.length === 0) {
      return res.status(400).json({ message: "orderedTaskIds is required" });
    }

    const normalizedIds = orderedTaskIds.map((id) => String(id));
    const uniqueIds = new Set(normalizedIds);

    if (uniqueIds.size !== normalizedIds.length) {
      return res.status(400).json({ message: "orderedTaskIds contains duplicates" });
    }

    const tasks = await Task.find({
      submainId,
      _id: { $in: normalizedIds },
    }).select("_id");

    if (tasks.length !== normalizedIds.length) {
      return res.status(400).json({ message: "Some tasks are invalid for this sub main" });
    }

    const bulkOps = normalizedIds.map((taskId, index) => ({
      updateOne: {
        filter: { _id: taskId, submainId },
        update: { $set: { order: index + 1 } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    const reorderedTasks = await Task.find({ submainId }).sort({ order: 1, createdAt: 1, _id: 1 });

    return res.status(200).json({
      message: "Tasks reordered successfully",
      tasks: reorderedTasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const getSubMainName = async (req, res)=>{
  try {
    const {id} = req.params
    const name = await SubMain.findById(id)
    if (! name )
      return res.status(400).json({message :  'No Name'})

    res.status(200).json({
      data : name.name
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export const getMainName = async (req, res) => {
  try {
    const { id } = req.params; // id is Sub Main ID

    // 1. Find the SubMain entry
    const subMain = await SubMain.findById(id);
    if (!subMain) {
      return res.status(404).json({ message: "No Sub Main found with this ID" });
    }

    // 2. Find the Main entry using subMain.mainId
    const main = await Main.findById(subMain.mainId);
    if (!main) {
      return res.status(404).json({ message: "No Main found for the provided Sub Main" });
    }

    // 3. Return the Main name or full Main data
    res.status(200).json({
      message: "Main Website is available",
      data: {
        mainName: main.name, // or `main.title`, based on your schema
        mainId: main._id
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

