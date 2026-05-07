import express from "express";
import {
  createData,
  deleteDealine,
  getAllData,
  getOneData,
  updateData,
} from "./../controller/deadline.controller.js";

const deadlineRouter = express.Router();

deadlineRouter.route('/').get(getAllData)

deadlineRouter.route("/add").post(createData);

deadlineRouter
  .route("/:id")
  .get(getOneData)
  .patch(updateData)
  .delete(deleteDealine);


export default deadlineRouter;
