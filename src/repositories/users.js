import { User } from "../db-init/models/user.js";

export const getUsers = async () => {
  try {
    const users = await User.find({}, "-password");

    if (users.length === 0) {
      let error = {
        statusCode: 404,
        customMessage: `No users exists.`,
      };
      throw error;
    }

    return { success: true, data: users };
  } catch (error) {
    console.log(
      `at: "repositories/users/getUsers" => ${JSON.stringify(error)}\n${error}`
    );
    return { success: false, message: error.message };
  }
};

export const getUserByEmail = async (email) => {
  try {
    const emailExists = await User.findOne({ email: email });

    if (!emailExists) {
      let error = {
        statusCode: 422,
        customMessage: `Email ${email} does not exist.`,
      };
      throw error;
    }

    return { success: true, data: emailExists };
  } catch (error) {
    console.log(
      `at: "repositories/users/getUserByEmail" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return { success: false, message: error.message };
  }
};

export const signup = async (data) => {
  try {
    const newUser = await User.create(data);

    if (!newUser) {
      let error = {
        statusCode: 408,
        customMessage: `Unable to create new user. Please try again later.`,
      };
      throw error;
    }

    return { success: true, data: newUser };
  } catch (error) {
    console.log(
      `at: "repositories/users/signup" => ${JSON.stringify(error)}\n${error}`
    );
    return { success: false, message: error.message };
  }
};
