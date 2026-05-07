import RemainingWork from "../model/RemainingWork.model.js";
import SubMain from "../model/SubMain.model.js";

const normalizeOrderForSubMain = async (submainId) => {
  const items = await RemainingWork.find({ submainId })
    .sort({ order: 1, createdAt: 1, _id: 1 })
    .select("_id order");

  if (!items.length) {
    return [];
  }

  const hasOrderMismatch = items.some((item, index) => item.order !== index + 1);
  if (!hasOrderMismatch) {
    return RemainingWork.find({ submainId }).sort({ order: 1, createdAt: 1, _id: 1 });
  }

  const bulkOps = items.map((item, index) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $set: { order: index + 1 } },
    },
  }));

  await RemainingWork.bulkWrite(bulkOps);

  return RemainingWork.find({ submainId }).sort({ order: 1, createdAt: 1, _id: 1 });
};

const getNextOrderForSubMain = async (submainId) => {
  const lastItem = await RemainingWork.findOne({ submainId })
    .sort({ order: -1, createdAt: -1, _id: -1 })
    .select("order");

  if (!lastItem) {
    return 1;
  }

  const order = Number(lastItem.order);
  if (!Number.isFinite(order) || order < 1) {
    const count = await RemainingWork.countDocuments({ submainId });
    return count + 1;
  }

  return order + 1;
};

export const addRemainingWork = async (req, res) => {
  try {
    const { submainId, content } = req.body;

    const submain = await SubMain.findById(submainId);
    if (!submain) {
      return res.status(404).json({ message: "SubMain not found" });
    }

    const nextOrder = await getNextOrderForSubMain(submainId);

    const item = new RemainingWork({
      userId: req._id,
      submainId,
      content,
      order: nextOrder,
    });

    const savedItem = await item.save();

    return res.status(201).json({
      message: "Remaining work created successfully",
      item: savedItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getRemainingWorkBySubMain = async (req, res) => {
  try {
    const { id } = req.params;

    let items = await RemainingWork.find({ submainId: id }).sort({ order: 1, createdAt: 1, _id: 1 });

    if (items.length === 0) {
      return res.status(200).json({
        message: "Remaining work retrieved successfully",
        items: [],
      });
    }

    const hasInvalidOrder = items.some((item, index) => item.order !== index + 1);
    if (hasInvalidOrder) {
      items = await normalizeOrderForSubMain(id);
    }

    return res.status(200).json({
      message: "Remaining work retrieved successfully",
      items,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateRemainingWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const item = await RemainingWork.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Remaining work item not found" });
    }

    item.content = content;
    await item.save();

    if (item.submainId) {
      await normalizeOrderForSubMain(item.submainId);
    }

    return res.status(200).json({
      message: "Remaining work updated successfully",
      item,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteRemainingWork = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await RemainingWork.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Remaining work item not found" });
    }

    if (item.submainId) {
      await normalizeOrderForSubMain(item.submainId);
    }

    return res.status(200).json({
      message: "Remaining work deleted successfully",
      item,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
