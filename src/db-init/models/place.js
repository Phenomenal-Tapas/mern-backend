import mongoose from "mongoose";
import Joi from "joi";

export const placeSchema = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
};

let place = new mongoose.Schema(placeSchema, { collection: "places" });

export const Place = mongoose.model("Place", place);

export const validatePlace = (place) => {
  const placeSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    image: Joi.required(),
  });
  const result = placeSchema.validate(place);
  return result;
};
