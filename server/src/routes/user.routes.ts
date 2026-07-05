import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateProfileSchema } from "../validators/auth.validator";

const router = Router();

router.patch("/me", authenticate, validate(updateProfileSchema), userController.updateProfile);

export default router;
