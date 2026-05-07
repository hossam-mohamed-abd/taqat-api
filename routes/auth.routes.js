import express from "express";
import { login, register } from "../controller/auth.controller.js";
import { validation } from "../middleware/validate.js";
import {
  createUserValidation,
  loginUserValidation,
} from "../service/auth.validation.js";

const authRouter = express.Router();

authRouter.route("/register").post(validation(createUserValidation), register);
authRouter.route("/login").post(validation(loginUserValidation), login);


export default authRouter;