import express from "express";
import pkg from "body-parser";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { createConnection } from "./db-init/dbConn.js";
import error from "./middlewares/error.js";
import placesRoutes from "./routes/places.js";
import usersRoutes from "./routes/users.js";

dotenv.config();
const { json, urlencoded } = pkg;
const app = express();
const port = process.env.PORT || 5000;

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.disable("x-powered-by");
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.disable("etag");

app.use(
  "/src/uploads/images",
  express.static(path.join("src", "uploads", "images"))
);

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  let error = {
    statusCode: 404,
    customMessage: "Could not find this route.",
  };
  throw error;
});

app.use(error);

createConnection();
app
  .listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  })
  .on("error", (error) => {
    console.log(JSON.stringify(error));
  });
