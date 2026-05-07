import express from "express";
import {
  createSubMain,
  getAllSubMain,
  getOneSubMain,
  updateSubMain,
  deleteSubMain
} from "../controller/submain.controller.js";
import { validation } from "../middleware/validate.js";
import { createSubMainValidation } from "../service/main.validation.js";
import { authentication } from "../middleware/auth.js";

const subMainRoutes = express.Router();

subMainRoutes.use(authentication);

subMainRoutes
  .route("/create-submain")
  .post(validation(createSubMainValidation), createSubMain);

subMainRoutes.route('/').get(getAllSubMain)
subMainRoutes
  .route("/:id")
  .get(getOneSubMain)
  .patch(updateSubMain)
  .delete(deleteSubMain);

export default subMainRoutes;
