import express from "express";
import * as controllers from "../controllers";

export const router = express.Router();

router.get("/", controllers.configuration.signup);
