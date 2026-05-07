import joi from "joi";

const objectId = joi
  .string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message("Invalid id format");

const addRemainingWorkValidation = joi.object({
  submainId: objectId.required(),
  content: joi.string().trim().min(1).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content is required",
    "any.required": "Content is required",
  }),
});

const getRemainingWorkBySubmainValidation = joi.object({
  id: objectId.required(),
});

const updateRemainingWorkValidation = joi.object({
  id: objectId.required(),
  content: joi.string().trim().min(1).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content is required",
    "any.required": "Content is required",
  }),
});

const deleteRemainingWorkValidation = joi.object({
  id: objectId.required(),
});

export {
  addRemainingWorkValidation,
  getRemainingWorkBySubmainValidation,
  updateRemainingWorkValidation,
  deleteRemainingWorkValidation,
};
