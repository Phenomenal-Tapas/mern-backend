import mongoose from "mongoose";

export let database;

export const createConnection = () => {
  // local host url
  // const url = "mongodb://localhost:27017/your_places";

  const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y1cbngt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

  if (database) {
    return;
  }

  mongoose.connect(url);
  database = mongoose.connection;
  database.once("open", async () => {
    console.log("Connected to database");
  });

  database.on("error", () => {
    console.log("ALERT => Error connecting to database");
  });
};

export const disconnect = () => {
  if (!database) {
    return;
  }

  mongoose.disconnect();
};
