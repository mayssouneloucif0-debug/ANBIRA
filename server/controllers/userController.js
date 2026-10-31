import bcrypt from "bcryptjs";

import {
  createUser as createMySqlUser,
  getAllUsers,
  getUserForLogin,
} from "../models/userModel.js";

import { createAccessToken } from "../utils/authToken.js";


// ======================================================
// GET ALL MANAGER USERS
// ======================================================

export const listManagerUsers = async (_req, res, next) => {
  try {
    const users = await getAllUsers();

    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
};


// ======================================================
// CREATE NEW MANAGER USER
// ======================================================

export const addManagerUser = async (req, res, next) => {
  const { name, email, password } = req.body || {};

  // Validate input
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return res.status(400).json({
      message:
        "الاسم والبريد وكلمة مرور من 8 أحرف على الأقل مطلوبة.",
    });
  }

  try {
    // Hash the password before saving it
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await createMySqlUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    });

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    // Duplicate email
    if (
      error.code === "ER_DUP_ENTRY" ||
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        message: "البريد الإلكتروني مستخدم مسبقًا.",
      });
    }

    next(error);
  }
};


// ======================================================
// MANAGER LOGIN
// ======================================================

export const managerLogin = async (req, res, next) => {
  console.log("LOGIN ROUTE REACHED");

  const { email, password } = req.body || {};

  // Validate login data
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: "البريد الإلكتروني وكلمة المرور مطلوبان.",
    });
  }

  try {
    // Find the user by email
    const user = await getUserForLogin(
      email.trim().toLowerCase()
    );

    // User does not exist
    if (!user) {
      return res.status(401).json({
        message: "بيانات الدخول غير صحيحة.",
      });
    }

    // Compare entered password with the stored password hash
    const passwordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    // Password is incorrect
    if (!passwordCorrect) {
      return res.status(401).json({
        message: "بيانات الدخول غير صحيحة.",
      });
    }

    // Public user information
    // We never send the password hash to the frontend
    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    // Create authentication token
    const accessToken = createAccessToken(user);

    // Send successful login response
    res.json({
      message: "تم تسجيل الدخول بنجاح.",

      token: accessToken,

      accessToken,

      manager: publicUser,

      user: publicUser,
    });
  } catch (error) {
    next(error);
  }
};


// ======================================================
// GET CURRENT LOGGED-IN USER
// ======================================================

export const getCurrentUser = async (req, res) => {
  res.json({
    data: req.user,
  });
};