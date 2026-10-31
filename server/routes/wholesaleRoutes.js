import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  addWholesaleOrder,
  editWholesaleOrder,
  getWholesaleOrder,
  listWholesaleOrders,
  removeWholesaleOrder,
} from "../controllers/wholesaleController.js";
import { requireAuth, requireManager } from "../middleware/auth.js";

const router = Router();

const uploadDirectory = path.resolve(
  "server/uploads/wholesale"
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const safeExtension = /^\.(jpg|jpeg|png|webp|gif)$/.test(
      extension
    )
      ? extension
      : ".jpg";

    const uniqueName =
      `wholesale-${Date.now()}-${Math.round(
        Math.random() * 1_000_000_000
      )}${safeExtension}`;

    callback(null, uniqueName);
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

router.get("/", listWholesaleOrders);

router.post(
  "/",
  upload.single("designImage"),
  addWholesaleOrder
);

router.get("/:id", getWholesaleOrder);

router.put(
  "/:id",
  upload.single("designImage"),
  editWholesaleOrder
);

router.delete("/:id", requireAuth, requireManager, removeWholesaleOrder);

export default router;