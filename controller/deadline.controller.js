import Deadline from "../model/Deadline.model.js";
import SubMain from "../model/SubMain.model.js";

export const createData = async (req, res) => {
  try {
    const { submainId, date, notes } = req.body;

    // Check if the submainId exists
    const subMain = await SubMain.findById(submainId);
    if (!subMain) {
      return res.status(404).json({ message: "SubMain not found" });
    }

    // Create a new Kader
    const newData = new Deadline({
      submainId,
      date,
      notes,
    });

    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    console.error("Error creating Data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllData = async (req, res) => {
  try {
    const allData = await Deadline.find({});
    if (allData.length == 0)
      return res.status(404).json({ message: `No Data Available` });

    res.status(200).json({
      data: allData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error : ${error}` });
  }
};

export const getOneData = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Deadline.findById(id);
    if (!data)
      return res.status(404).json({ message: "No Data With this id " });

    res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error : ${error}` });
  }
};

export const updateData = async (req, res) => {
  try {
    const newdata = req.body;
    const data = await Deadline.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data is not available" });
    }

    data.submainId = newdata.submainId || data.submainId;
    data.date = newdata.date || data.date;
    data.notes = newdata.notes || data.notes;
    await data.save();
    res.status(200).json({
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDealine = async (req , res )=>{
     try {
    const { id } = req.params;
    const data = await Deadline.findByIdAndDelete(id);
    if (!data)
      return res.status(404).json({ message: "Data is not available" });

    res.status(200).json({
      message: "Data is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}