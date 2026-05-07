import express from "express";
import {
  createTask,
  deleteTaskByID,
  getAllTasks,
  getMainName,
  getSubMainName,
  getTaskByID,
  getTasksBySubMainId,
  printTasks,
  reorderTasks,
  updateTask,
} from "../controller/task.controller.js";
import { createTaskValidation, reorderTasksValidation } from "../service/task.validation.js";
import { validation } from "../middleware/validate.js";
import { authentication } from "../middleware/auth.js";

const taskRoutes = express.Router();

// Must Login
taskRoutes.route('/export-data/:subMainId').get(printTasks)

taskRoutes.use(authentication);

taskRoutes
  .route("/create-task")
  .post(validation(createTaskValidation), createTask);

taskRoutes.route("/").get(getAllTasks);
taskRoutes.route('/getbySubId/:id').get(getTasksBySubMainId)
taskRoutes.route('/reorder/:submainId').patch(validation(reorderTasksValidation), reorderTasks)

taskRoutes.route('/get-main/:id').get(getMainName)

taskRoutes
  .route("/:id")
  .get(getTaskByID)
  .patch(updateTask)
  .delete(deleteTaskByID);

  taskRoutes.route('/get-name/:id').get(getSubMainName)
  
export default taskRoutes;