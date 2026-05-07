import express from "express";
import {
  addRemainingWork,
  deleteRemainingWork,
  getRemainingWorkBySubMain,
  updateRemainingWork,
} from "../controller/remainingWork.controller.js";
import { authentication } from "../middleware/auth.js";
import { validation } from "../middleware/validate.js";
import {
  addRemainingWorkValidation,
  deleteRemainingWorkValidation,
  getRemainingWorkBySubmainValidation,
  updateRemainingWorkValidation,
} from "../service/remaining-work.validation.js";

const remainingWorkRoutes = express.Router();

remainingWorkRoutes.use(authentication);

remainingWorkRoutes
  .route("/add")
  .post(validation(addRemainingWorkValidation), addRemainingWork);

remainingWorkRoutes
  .route("/submain/:id")
  .get(validation(getRemainingWorkBySubmainValidation), getRemainingWorkBySubMain);

remainingWorkRoutes
  .route("/:id")
  .patch(validation(updateRemainingWorkValidation), updateRemainingWork)
  .delete(validation(deleteRemainingWorkValidation), deleteRemainingWork);

export default remainingWorkRoutes;
