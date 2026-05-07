import Main from "../model/Main.model.js";

export const createMain = async (req, res) => {
  try {
    const data = req.body;
    const userId = req._id;

    

    const newMain = new Main({
      userId,
      name: data.name,
    });
    const savedMain = await newMain.save();
    res.status(201).json({
      message: "Sub Main created successfully",
      subMain: savedMain,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getallMains = async (req, res) => {
  try {
    const data = await Main.find({});
    if (data.length == 0)
      return res.status(404).json({ message: "No Main Website Found " });

    res
      .status(200)
      .json({ message: "Data Of Website ", total: data.length, data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getOneMain = async (req, res) => {
  const { id } = req.params;
  const data = await Main.findById(id);
  if (!data) return res.status(404).json({ message: "No Data Found !" });

  res.status(200).json({ message: "Data is available", data: data });
};
export const deleteMain = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Main.findByIdAndDelete(id);
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
};

export const updateMain = async (req, res) => {
  try {
    const newdata = req.body;
    const data = await Main.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data is not available" });
    }

    data.name = newdata.name || data.name;
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
