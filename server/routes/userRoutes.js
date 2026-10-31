import { Router } from "express";

import {
  managerLogin,
  getCurrentUser,
  listManagerUsers,
  addManagerUser,
} from "../controllers/userController.js";

import {
  requireAuth,
  requireManager,
} from "../middleware/auth.js";

const authRouter = Router();
const usersRouter = Router();

/*
  تسجيل دخول المدير
*/
authRouter.post("/login", managerLogin);

/*
  الحصول على بيانات المدير الحالي
*/
authRouter.get("/me", requireAuth, getCurrentUser);

/*
  قائمة المديرين
*/
usersRouter.get(
  "/",
  requireAuth,
  requireManager,
  listManagerUsers
);

/*
  إضافة مدير جديد
*/
usersRouter.post(
  "/",
  requireAuth,
  requireManager,
  addManagerUser
);

export { authRouter, usersRouter };