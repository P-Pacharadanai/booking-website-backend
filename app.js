import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./apps/auth.js";
import bookRouter from "./apps/booking.js";

async function init() {
  const app = express();
  const port = 4000;

  dotenv.config();

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/auth", authRouter);
  app.use("/book", bookRouter);

  app.get("/", (req, res) => {
    res.send("App is running...");
  });

  app.get("*", (req, res) => {
    res.status(404).send("Not found");
  });

  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

init();
