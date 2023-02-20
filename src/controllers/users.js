import { validateUser } from "../db-init/models/user.js";
import * as usersRepositories from "../repositories/users.js";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "test",
    email: "test@gmail.com",
    password: "testPassword",
    image:
      "https://images.unsplash.com/photo-1673405009507-c961600a48a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDR8RnpvM3p1T0hONnd8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    places: "p1",
  },
];

const getUsers = async (req, res, next) => {
  try {
    const users = await usersRepositories.getUsers();

    if (!users.success) {
      let error = {
        statusCode: 404,
        customMessage: `No users exists.`,
      };
      throw error;
    }

    return {
      isError: false,
      users: users.data,
    };
  } catch (error) {
    console.log(
      `at: "controllers/users/getUsers" => ${JSON.stringify(error)}\n${error}`
    );
    return {
      isError: true,
      error: error,
    };
  }
};

const signup = async (data) => {
  try {
    const { name, email, password, image } = data;

    const validateData = {
      name,
      email,
      password,
      image,
    };

    const validateError = validateUser(validateData);

    if (validateError.error) {
      throw {
        statusCode: 400,
        customMessage: "Some parameters are invalid.",
      };
    }

    const emailExists = await usersRepositories.getUserByEmail(
      validateData.email
    );

    if (emailExists.success) {
      let error = {
        statusCode: 422,
        customMessage: `Email already exists. Please login instead!!`,
      };
      throw error;
    }

    const newUser = {
      name: validateData.name,
      email: validateData.email,
      password: validateData.password,
      image: validateData.image.path,
      places: [],
    };

    const result = await usersRepositories.signup(newUser);

    if (!result.success) {
      let error = {
        statusCode: 408,
        customMessage: `Unable to create new user. Please try again later.`,
      };
      throw error;
    }

    return {
      isError: false,
      user: result.data,
    };
  } catch (error) {
    console.log(
      `at: "controllers/users/signup" => ${JSON.stringify(error)}\n${error}`
    );
    return {
      isError: true,
      error: error,
    };
  }
};

const fetchUserByEmail = async (email) => {
  try {
    const userExists = await usersRepositories.getUserByEmail(email);

    if (!userExists.success) {
      let error = {
        statusCode: 401,
        customMessage: `User not found. Please enter valid email.`,
      };
      throw error;
    }

    return {
      isError: false,
      user: userExists.data,
    };
  } catch (error) {
    console.log(
      `at: "controllers/users/login" => ${JSON.stringify(error)}\n${error}`
    );
    return {
      isError: true,
      error: error,
    };
  }
};

export default { getUsers, signup, fetchUserByEmail };
