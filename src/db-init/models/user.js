import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import Joi from "joi";

export const userSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
};

let user = new mongoose.Schema(userSchema, { collection: "users" });

user.plugin(uniqueValidator);

export const User = mongoose.model("User", user);

export const validateUser = (user) => {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    image: Joi.required(),
  });
  const result = userSchema.validate(user);
  return result;
};
