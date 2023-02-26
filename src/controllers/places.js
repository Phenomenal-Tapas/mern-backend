import { validatePlace } from "../db-init/models/place.js";
import { getCoordinates } from "../helpers/get-coordinates.js";
import * as placesRepositories from "../repositories/places.js";

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Arthur Ravenel Jr. Bridge, Charleston, United States",
    imageUrl:
      "https://images.unsplash.com/photo-1512187849-463fdb898f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YnJpZGdlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    description:
      "This is one of my favorite architectural structures in Charleston, SC.",
    address: "South Carolina, USA",
    location: {
      lat: 32.8039122,
      lng: -79.9228585,
    },
    creator: "u1",
  },
];

const getPlaceById = async (placeId) => {
  try {
    const place = await placesRepositories.getPlaceById(placeId);

    if (!place.success) {
      let error = {
        statusCode: 404,
        customMessage: `Place not found for the provided placeId.`,
      };
      throw error;
    }

    return {
      isError: false,
      place: place.data,
    };
  } catch (error) {
    console.log(
      `at: "controllers/places/getPlaceById" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return {
      isError: true,
      error: error,
    };
  }
};

const getPlacesByUserId = async (userId) => {
  try {
    const places = await placesRepositories.getPlacesByUserId(userId);

    if (!places.success) {
      let error = {
        statusCode: 404,
        customMessage: `Places not found for the provided userId.`,
      };
      throw error;
    }

    return {
      isError: false,
      places: places.data,
    };
  } catch (error) {
    console.log(
      `at: "controllers/places/getPlacesByUserId" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return {
      isError: true,
      error: error,
    };
  }
};

const createPlace = async (data) => {
  try {
    const { title, description, address, image, creator } = data;

    const validateData = {
      title,
      description,
      address,
      image,
    };

    const validateError = validatePlace(validateData);

    if (validateError.error) {
      throw {
        statusCode: 400,
        customMessage: "Some parameters are invalid.",
      };
    }

    const coordinates = await getCoordinates();

    const createdPlace = {
      title: validateData.title,
      description: validateData.description,
      address: validateData.address,
      location: coordinates,
      image: validateData.image.filename,
      creator,
    };

    const result = await placesRepositories.createPlace(createdPlace);

    if (!result.success) {
      let error = {
        statusCode: 408,
        customMessage: `Could not find creator with id ${creator}.`,
      };
      throw error;
    }

    return {
      isError: false,
      place: result.data,
    };
  } catch (error) {
    console.log(
      `at: "controllers/places/createPlace" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return {
      isError: true,
      error: error,
    };
  }
};

const updatePlaceById = async (placeId, data) => {
  try {
    const result = await placesRepositories.updatePlaceById(placeId, data);

    if (!result.success) {
      let error = {
        statusCode: 404,
        customMessage: `Unable to update place ${placeId}.`,
      };
      throw error;
    }

    return {
      isError: false,
      updatedPlace: result.place,
    };
  } catch (error) {
    console.log(
      `at: "controllers/places/updatePlaceById" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return {
      isError: true,
      error: error,
    };
  }
};

const deletePlaceById = async (placeId) => {
  try {
    const result = await placesRepositories.deletePlaceById(placeId);

    if (!result.success) {
      let error = {
        statusCode: 404,
        customMessage: `Unable to delete place ${placeId}.`,
      };
      throw error;
    }

    return {
      isError: false,
    };
  } catch (error) {
    console.log(
      `at: "controllers/places/deletePlaceById" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return {
      isError: true,
      error: error,
    };
  }
};

export default {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
};
