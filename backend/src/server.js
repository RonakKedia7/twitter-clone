import express from "express";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(clerkMiddleware());

app.listen(5001, () => console.log("Server is up and running on PORT:5001"));
