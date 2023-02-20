import { Router } from "express";
import placesControllers from "../controllers/places.js";
import upload from "../middlewares/file-upload.js";
import checkAuth from "../middlewares/check-auth.js";

const router = Router();

router.get("/:pid", async (req, res, next) => {
  try {
    const placeId = req.params.pid;

    const result = await placesControllers.getPlaceById(placeId);

    if (result.isError) {
      throw result.error;
    }

    res.status(200).json({
      status: 200,
      place: result.place,
      message: `Successfully fetched place with ${placeId}.`,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user/:uid", async (req, res, next) => {
  try {
    const userId = req.params.uid;

    const result = await placesControllers.getPlacesByUserId(userId);

    if (result.isError) {
      throw result.error;
    }

    res.status(200).json({
      status: 200,
      places: result.places,
      message: `Successfully fetched places with ${userId}.`,
    });
  } catch (error) {
    next(error);
  }
});

// authentication
router.use(checkAuth);

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const { title, description, address } = req.body;

    if (!title || !description || !address) {
      let error = {
        statusCode: 400,
        customMessage: "All parameters required.",
      };
      throw error;
    }

    const placeData = {
      title,
      description,
      address,
      image: req.file,
      creator: req.user.userId,
    };

    const result = await placesControllers.createPlace(placeData);

    if (result.isError) {
      throw result.error;
    }

    res.status(201).json({
      status: 201,
      place: result.place,
      message: "Successfully created a new place.",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:pid", async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const placeId = req.params.pid;

    if (!title || !description) {
      let error = {
        statusCode: 400,
        customMessage: "All parameters required.",
      };
      throw error;
    }

    const updatePlace = {
      title,
      description,
    };

    const result = await placesControllers.updatePlaceById(
      placeId,
      updatePlace
    );

    if (result.isError) {
      throw result.error;
    }

    res.status(200).json({
      status: 200,
      place: result.updatedPlace,
      message: "Successfully updated a place.",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:pid", async (req, res, next) => {
  try {
    const placeId = req.params.pid;

    const result = await placesControllers.deletePlaceById(placeId);

    if (result.isError) {
      throw result.error;
    }

    res.status(200).json({
      status: 200,
      message: "Successfully deleted a place.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
