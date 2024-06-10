import express from "express";

import UserController from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createUserSchema,
  loginUserSchema,
  updateSubscriptionSchema,
  verificationEmailSchema,
} from "../schemas/usersSchemas.js";
import authMiddleware from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/register",
  validateBody(createUserSchema),
  UserController.register
);
router.post("/login", validateBody(loginUserSchema), UserController.login);
router.get("/current", authMiddleware, UserController.current);
router.post("/logout", authMiddleware, UserController.logout);
router.patch(
  "/",
  authMiddleware,
  validateBody(updateSubscriptionSchema),
  UserController.updateSubscription
);
router.get("/avatars", authMiddleware, UserController.avatar);
router.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  UserController.changeAvatar
);

router.get("/verify/:verificationToken", UserController.verifyEmail);
router.post("/verify/", 
validateBody(verificationEmailSchema),
UserController.resendVerifyEmail);

export default router;
