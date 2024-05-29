import Joi from "joi";

export const createUserSchema = Joi.object({
   token: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})