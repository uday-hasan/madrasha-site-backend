import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";

// ================================
// MAIN ROUTER
// Combines all module routers into one.
// Adding a new module = one line here.
// ================================

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
