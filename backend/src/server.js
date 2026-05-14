import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(clerkMiddleware());

connectDB();

app.get("/", (req, res) => res.send("Hello"));

app.listen(ENV.PORT, () =>
  console.log(`Server is up and running on PORT:${ENV.PORT}`),
);
