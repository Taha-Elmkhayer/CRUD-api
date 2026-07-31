import express from "express";
import * as authController from "../controller/auth.js";

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/verify/:token", authController.verifyEmail);

export default router;
