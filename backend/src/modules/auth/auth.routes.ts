import { Router } from "express";
import { adminTest, getMe, login, register } from "./auth.controller";
import validate from "../../middleware/validate.middleware";
import { loginSchema, registerSchema } from "./auth.validation";
import { protect } from "../../middleware/auth.middleware";
import { Role } from "@prisma/client";
import { restrictTo } from "../../middleware/role.middleware";

const router = Router();
// Define the registration route
router.post("/register", validate(registerSchema), register);
// Define the login route
router.post("/login", validate(loginSchema), login);
// Define the getMe route
router.get("/me", protect, getMe);
// Define the admin test route that is only accessible to admin users
router.get("/admin-test", protect, restrictTo(Role.ADMIN), adminTest);
export default router;