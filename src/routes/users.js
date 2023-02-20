import { Router } from "express";
import { getHashedPassword } from "../helpers/get-hashed-password.js";
import { getJWT } from "../helpers/get-jwt.js";
import bcrypt from "bcrypt";
import usersControllers from "../controllers/users.js";
import upload from "../middlewares/file-upload.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await usersControllers.getUsers();

    if (result.isError) {
      throw result.error;
    }

    res.status(200).json({
      status: 200,
      users: result.users,
      message: `Successfully fetched users.`,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/signup", upload.single("image"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      let error = {
        statusCode: 400,
        customMessage: "All parameters required.",
      };
      throw error;
    }

    const hashedPassword = await getHashedPassword(password);

    const userData = {
      name,
      email,
      password: hashedPassword,
      image: req.file,
    };

    const result = await usersControllers.signup(userData);

    if (result.isError) {
      throw result.error;
    }

    const generateTokenWithUserData = {
      userId: result.user?._id,
      email: result.user?.email,
    };
    const token = await getJWT(generateTokenWithUserData);

    res.status(201).json({
      status: 201,
      user: result.user,
      token: token,
      message: "Successfully created a new user.",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      let error = {
        statusCode: 400,
        customMessage: "All parameters required.",
      };
      throw error;
    }

    const isUserExists = await usersControllers.fetchUserByEmail(email);

    const result = {
      userId: isUserExists.user?._id,
      email: isUserExists.user?.email,
    };

    if (!isUserExists.isError) {
      const validatePassword = await bcrypt.compare(
        password,
        isUserExists.user.password
      );
      if (validatePassword) {
        const token = await getJWT(result);

        res.status(200).json({
          status: 200,
          token: token,
          user: isUserExists.user,
          message: `User with email: ${email} logged in successfully.`,
        });
      } else {
        let err = {
          statusCode: 400,
          customMessage: "Invalid Password.",
        };
        throw err;
      }
    } else {
      let err = {
        statusCode: 400,
        customMessage: "Invalid Email.",
      };
      throw err;
    }
  } catch (error) {
    next(error);
  }
});

export default router;
