import Main from "../model/Main.model.js";
import SubMain from "../model/SubMain.model.js";

export const createSubMain = async (req, res) => {
  try {
    const subMain = req.body;
    const userId = req._id;
    const mainId = await Main.findById({ _id: subMain.mainId });
    if (!mainId)
      return res
        .status(404)
        .josn({ message: `No Main Website with this ID : ${subMain.mainId}` });

    const newSubMain = new SubMain({
      userId,
      mainId,
      name: subMain.name,
    });
    const savedMain = await newSubMain.save();
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

// export const getAllSubMain = async (req, res) => {
//   try {
//     const data = await SubMain.find();
//     if (data.length == 0)
//       return res.status(404).json({ message: `No Sub Main Available Yet !` });

//     res.status(200).json({
//       message: `Sub Main Available`,
//       total: data.length,
//       data,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };


export const getAllSubMain = async (req, res) => {
  try {
    const { mainId } = req.query;

    // بناء الفلتر: إذا mainId موجود هنفلتر به، لو مش موجود هنرجع الكل
    const filter = mainId ? { mainId } : {};

    const data = await SubMain.find(filter);
    if (data.length === 0) {
      return res.status(404).json({ message: `No Sub Main Available Yet!` });
    }

    res.status(200).json({
      message: `Sub Mains Available`,
      total: data.length,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getOneSubMain = async (req, res) => {
  try {
    const { id } = req.params;
    const subMain = await SubMain.findById(id);
    if (!subMain)
      return res.status(404).json({ message: `No Sub Main With This With ID` });
    res.status(200).json({
      message: "Sub Main Available successfully",
      subMain,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateSubMain = async (req, res) => {
  try {
    const newdata = req.body;
    const data = await SubMain.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data is not available" });
    }
    
    data.mainId = newdata.mainId || data.mainId;
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

export const deleteSubMain = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await SubMain.findByIdAndDelete(id);
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
