import joi from "joi";

let createMainValidation = joi.object({
  userId: joi.string().min(3).trim().optional(),
  name: joi.string().min(3).trim().max(50).required(),
});
let createSubMainValidation = joi.object({
  userId: joi.string().min(3).trim().optional(),
  mainId: joi.string().min(3).trim().optional(),
  name: joi.string().min(3).trim().max(50).required(),
});

export {
    createMainValidation,createSubMainValidation
}