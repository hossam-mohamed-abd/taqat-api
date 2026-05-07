import Kader from "../model/Kader.model.js";
import SubMain from "../model/SubMain.model.js";
import {
  DEFAULT_KADER_NAME_COLOR,
  KADER_NAME_COLOR_ALIASES,
  KADER_NAME_COLOR_VALUES,
} from "../constants/kader.constants.js";

const normalizeText = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const resolveNameColor = (value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  const mappedColor = KADER_NAME_COLOR_ALIASES[normalized];
  if (!mappedColor) {
    return undefined;
  }

  return mappedColor;
};

export const createKader = async (req, res) => {
  try {
    const { submainId, name, tasks, nameColor } = req.body;

    const subMain = await SubMain.findById(submainId);
    if (!subMain) {
      return res.status(404).json({ message: "SubMain not found" });
    }

    const normalizedName = normalizeText(name);
    const normalizedTasks = normalizeText(tasks);
    if (!normalizedName && !normalizedTasks) {
      return res.status(400).json({ message: "Name or tasks is required" });
    }

    const normalizedColor = resolveNameColor(nameColor) || DEFAULT_KADER_NAME_COLOR;

    const newKader = await Kader.create({
      submainId,
      name: normalizedName,
      tasks: normalizedTasks,
      nameColor: normalizedColor,
    });

    return res.status(201).json({
      message: "Kader created successfully",
      data: newKader,
    });
  } catch (error) {
    console.error("Error creating Kader:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllKaders = async (req, res) => {
  try {
    const kaders = await Kader.find();
    return res.status(200).json({ data: kaders });
  } catch (error) {
    console.error("Error fetching Kaders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getKaderById = async (req, res) => {
  try {
    const { id } = req.params;
    const kader = await Kader.findById(id);
    if (!kader) {
      return res.status(404).json({ message: `No Kader with this ID : ${id}` });
    }

    return res.status(200).json({
      data: kader,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Internal Server Error : ${error.message}` });
  }
};

export const updateKader = async (req, res) => {
  try {
    const newdata = req.body;
    const data = await Kader.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data is not available" });
    }

    if (newdata.submainId !== undefined) {
      const subMain = await SubMain.findById(newdata.submainId);
      if (!subMain) {
        return res.status(404).json({ message: "SubMain not found" });
      }
      data.submainId = newdata.submainId;
    }

    if (newdata.name !== undefined) {
      data.name = normalizeText(newdata.name);
    }

    if (newdata.tasks !== undefined) {
      data.tasks = normalizeText(newdata.tasks);
    }

    if (newdata.nameColor !== undefined) {
      const normalizedColor = resolveNameColor(newdata.nameColor);
      if (!normalizedColor) {
        return res.status(400).json({
          message: `nameColor must be one of: ${KADER_NAME_COLOR_VALUES.join(", ")}`,
        });
      }
      data.nameColor = normalizedColor;
    }

    if (!data.name && !data.tasks) {
      return res.status(400).json({ message: "Name or tasks is required" });
    }

    await data.save();

    return res.status(200).json({
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteKader = async (req , res )=>{
  try {
    const { id } = req.params;
    const data = await Kader.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: "Data is not available" });
    }

    return res.status(200).json({
      message: "Data is deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};