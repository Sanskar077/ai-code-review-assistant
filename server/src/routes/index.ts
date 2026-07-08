import { Router } from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import v1Routes from "./v1";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
// New endpoints follow REST versioning (/api/v1/...) per Day 5's scope.
// auth/users predate this convention and are left unversioned rather than
// changed outside their own scope — see the Day 5 summary for this note.
router.use("/v1", v1Routes);

export default router;
