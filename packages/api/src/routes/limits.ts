import express from "express";
import * as controllers from "../controllers";
import { checkProfileQuery } from "../middleware/checkProfileQuery";
import { checkRegistrationToken } from "../middleware/checkRegistrationToken";
import { validateStoreLimitsBody } from "../middleware/validateStoreLimitsBody";
import { emitClosingSession } from "../middleware/emitClosingSession";

export const router = express.Router();

router.get("/", checkProfileQuery, controllers.limits.list);
router.post(
  "/:id",
  checkRegistrationToken,
  checkProfileQuery,
  validateStoreLimitsBody,
  emitClosingSession,
  controllers.limits.store
);
