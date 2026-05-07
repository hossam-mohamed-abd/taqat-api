import joi from 'joi';
import { KADER_NAME_COLOR_INPUT_VALUES } from '../constants/kader.constants.js';

const objectId = joi
  .string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message('Invalid id format');

const createKaderValidation = joi.object({
  submainId: objectId.required(),
  name: joi.string().trim().allow('').optional(),
  tasks: joi.string().trim().allow('').optional(),
  nameColor: joi.string().valid(...KADER_NAME_COLOR_INPUT_VALUES).optional(),
});

const updateKaderValidation = joi.object({
  id: objectId.required(),
  submainId: objectId.optional(),
  name: joi.string().trim().allow('').optional(),
  tasks: joi.string().trim().allow('').optional(),
  nameColor: joi.string().valid(...KADER_NAME_COLOR_INPUT_VALUES).optional(),
});

const kaderIdValidation = joi.object({
  id: objectId.required(),
});

export { createKaderValidation, updateKaderValidation, kaderIdValidation };
