import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  addProduct,
  editProduct,
  getProduct,
  listProducts,
  removeProduct,
} from "../controllers/productController.js";

import {
  requireAuth,
  requireManager,
} from "../middleware/auth.js";

const router = Router();

const uploadDirectory = path.join(
  process.cwd(),
  "server",
  "uploads",
  "products"
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);

    const uniqueName =
      `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "نوع الصورة غير مدعوم. اختاري JPG أو PNG أو WEBP."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/upload-image",
  requireAuth,
  requireManager,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "لم يتم اختيار صورة.",
      });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;

    res.status(201).json({
      message: "تم رفع الصورة بنجاح.",
      image: imageUrl,
    });
  }
);

router.get("/", listProducts);

router.post(
  "/",
  requireAuth,
  requireManager,
  addProduct
);

router.get("/:id", getProduct);

router.put(
  "/:id",
  requireAuth,
  requireManager,
  editProduct
);

router.delete(
  "/:id",
  requireAuth,
  requireManager,
  removeProduct
);

export default router;