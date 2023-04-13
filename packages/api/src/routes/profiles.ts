import express from "express";
import * as controllers from "../controllers";
import { checkProfileQuery } from "../middleware/checkProfileQuery";

export const router = express.Router();

router.get("/", controllers.profiles.list);
router.get("/status", checkProfileQuery, controllers.profiles.profileStatus);
