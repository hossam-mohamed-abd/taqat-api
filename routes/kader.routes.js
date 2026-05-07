import express from "express";
import {
  createKader,
  deleteKader,
  getAllKaders,
  getKaderById,
  updateKader,
} from "../controller/Kader.controller.js";
import { validation } from "../middleware/validate.js";
import {
  createKaderValidation,
  kaderIdValidation,
  updateKaderValidation,
} from "../service/kader.validation.js";

const kaderRouter = express.Router();

kaderRouter.route("/").get(getAllKaders);
// Must Login
// kaderRouter.use(authentication)

kaderRouter.route("/add").post(validation(createKaderValidation), createKader);
kaderRouter
  .route("/:id")
  .get(validation(kaderIdValidation), getKaderById)
  .patch(validation(updateKaderValidation), updateKader)
  .delete(validation(kaderIdValidation), deleteKader);

export default kaderRouter;
