import { Router } from "express";
import { getMe, login, register } from "./auth.controller";
import validate from "../../middleware/validate.middleware";
import { loginSchema, registerSchema } from "./auth.validation";
import { protect } from "../../middleware/auth.middleware";

const router = Router();
// Define the registration route
router.post("/register", validate(registerSchema), register);
// Define the login route
router.post("/login", validate(loginSchema), login);
// Define the getMe route
router.get("/me", protect, getMe);
export default router;