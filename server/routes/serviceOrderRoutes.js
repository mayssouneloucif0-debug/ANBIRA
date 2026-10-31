import { Router } from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";

import { tailoringController } from "../controllers/tailoringController.js";
import { requireAuth, requireManager } from "../middleware/auth.js";

const tailoringRouter = Router();

const uploadDirectory = path.resolve(
  process.cwd(),
  "server",
  "uploads",
  "tailoring"
);

fs.mkdirSync(uploadDirectory, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const safeExtension = /^\.[a-z0-9]{1,10}$/.test(extension)
      ? extension
      : ".jpg";

    callback(
      null,
      `design-${Date.now()}-${Math.round(
        Math.random() * 1_000_000
      )}${safeExtension}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(
        new Error("يُسمح برفع الصور فقط.")
      );
    }

    callback(null, true);
  },
});

tailoringRouter.get("/", tailoringController.list);

tailoringRouter.post(
  "/",
  upload.single("designImage"),
  tailoringController.create
);

tailoringRouter.delete(
  "/:id",
  requireAuth,
  requireManager,
  tailoringController.remove
);

export { tailoringRouter };
