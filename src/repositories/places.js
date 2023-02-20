import fs from "fs";
import { Place } from "../db-init/models/place.js";
import { User } from "../db-init/models/user.js";

export const getPlaceById = async (placeId) => {
  try {
    const place = await Place.findById(placeId);

    if (!place) {
      let error = {
        statusCode: 404,
        customMessage: `Place not found for the provided placeId.`,
      };
      throw error;
    }

    return { success: true, data: place };
  } catch (error) {
    console.log(
      `at: "repositories/places/getPlaceById" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return { success: false, message: error.message };
  }
};

export const getPlacesByUserId = async (userId) => {
  try {
    const places = await Place.find({ creator: userId });

    if (!places || places.length === 0) {
      let error = {
        statusCode: 404,
        customMessage: `Places not found for the provided userId.`,
      };
      throw error;
    }

    return { success: true, data: places };
  } catch (error) {
    console.log(
      `at: "repositories/places/getPlacesByUserId" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return { success: false, message: error.message };
  }
};

export const createPlace = async (data) => {
  try {
    const { title, description, address, creator, image, location } = data;

    const user = await User.findById(creator);
    if (!user) {
      let error = {
        statusCode: 408,
        customMessage: `Could not find creator with id ${creator}.`,
      };
      throw error;
    }

    const addedPlace = await Place.create({
      title,
      description,
      address,
      location,
      image,
      creator,
    });

    await User.findByIdAndUpdate(
      { _id: creator },
      {
        $push: {
          places: addedPlace,
        },
      }
    );

    return { success: true, data: addedPlace };
  } catch (error) {
    console.log(
      `at: "repositories/places/createPlace" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return { success: false, message: error.message };
  }
};

export const updatePlaceById = async (placeId, data) => {
  try {
    const { title, description } = data;
    const updatedPlace = await Place.findByIdAndUpdate(placeId, {
      $set: {
        title,
        description,
      },
    });

    if (!updatedPlace) {
      let error = {
        statusCode: 404,
        customMessage: `Unable to update place ${placeId}.`,
      };
      throw error;
    }

    return { success: true, place: updatedPlace };
  } catch (error) {
    console.log(
      `at: "repositories/places/updatePlaceById" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return { success: false, message: error.message };
  }
};

export const deletePlaceById = async (placeId) => {
  try {
    const getPlaceById = await Place.findById(placeId);

    const imagePath = getPlaceById.image;

    const deletePlace = await Place.findByIdAndDelete(placeId);

    const deleteUserFromPlacesArray = await User.findOneAndUpdate(
      getPlaceById.creator,
      {
        $pull: { places: placeId },
      }
    );

    if (!deletePlace || !deleteUserFromPlacesArray) {
      let error = {
        statusCode: 404,
        customMessage: `Unable to delete place ${placeId}.`,
      };
      throw error;
    }

    fs.unlink(imagePath, (err) => {
      console.log("err: ", err);
    });

    return { success: true };
  } catch (error) {
    console.log(
      `at: "repositories/places/deletePlaceById" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return { success: false, message: error.message };
  }
};
