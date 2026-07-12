import { Router } from "express";

import { reviewController } from "../../controllers/review.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createReviewFromPasteSchema } from "../../validators/review.validator";

const router = Router();

router.get("/:id", authenticate, reviewController.getById);

router.post("/", authenticate, validate(createReviewFromPasteSchema), reviewController.createFromPaste);

// Meta fields (title, language) are validated inside reviewService.createFromUpload
// rather than via `validate`, so a failure still cleans up the file Multer
// already wrote to disk — see server/src/services/review.service.ts.
router.post("/upload", authenticate, upload.single("file"), reviewController.createFromUpload);

export default router;
