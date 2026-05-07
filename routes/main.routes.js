import express from "express";
import {
  createMain,
  deleteMain,
  getallMains,
  getOneMain,
  updateMain,
} from "../controller/main.controller.js";
import { validation } from "../middleware/validate.js";
import { createMainValidation } from "../service/main.validation.js";
import { authentication } from "../middleware/auth.js";

const mainRouter = express.Router();

mainRouter.use(authentication);
mainRouter
  .route("/create-main")
  .post(validation(createMainValidation), createMain);

mainRouter.route("/:id").get(getOneMain).delete(deleteMain).patch(updateMain);
mainRouter.route("/").get(getallMains);

export default mainRouter;
