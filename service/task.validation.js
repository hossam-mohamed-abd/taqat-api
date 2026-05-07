import joi from "joi";
import { TASK_USERNAME_COLOR_INPUT_VALUES } from "../constants/task.constants.js";

let createTaskValidation = joi.object({
  userId: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid userId format")
    .optional(),
  submainId: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid mainId format")
    .optional(),

  username: joi.string().trim().optional().messages({
    "string.min": "Username should be at least 3 characters",
  }),

  usernameColor: joi.string().valid(...TASK_USERNAME_COLOR_INPUT_VALUES).optional(),

  date: joi.date().iso().optional().messages({
    "date.base": "Date must be a valid date",
    "date.format": "Date must be in ISO format (YYYY-MM-DD)",
  }),

  tasks: joi.string().trim().optional().messages({
    "string.min": "Tasks should be at least 3 characters",
  }),

  remainingWork: joi.string().trim().optional().messages({
    "string.min": "Remaining work should be at least 3 characters",
  }),
  number: joi.number().optional().messages({
    "string.min": "Number should be a valid number",
  }),
  notes: joi.string().trim().optional().messages({
    "string.min": "Notes should be at least 3 characters",
  }),
});

let reorderTasksValidation = joi.object({
  submainId: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid submainId format")
    .required(),
  orderedTaskIds: joi
    .array()
    .items(
      joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message("Invalid task id format")
    )
    .min(1)
    .required(),
});

export { createTaskValidation, reorderTasksValidation };
