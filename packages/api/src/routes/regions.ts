import express from "express";
import * as controllers from "../controllers";
import { checkProfileQuery } from "../middleware/checkProfileQuery";

export const router = express.Router();

router.get("/", checkProfileQuery, controllers.regions.listRegionSubscriptions);
