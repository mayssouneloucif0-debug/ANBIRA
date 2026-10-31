
import { getUserById } from "../models/userModel.js";
import { verifyAccessToken } from "../utils/authToken.js";

export const requireAuth = async (req, res, next) => {
  const [scheme, token] = (req.get("authorization") || "").split(" ");

  const payload =
    scheme === "Bearer" && token
      ? verifyAccessToken(token)
      : null;

  if (!payload) {
    return res.status(401).json({
      message: "يجب تسجيل الدخول أولًا.",
    });
  }

  try {
    const user = await getUserById(payload.sub);

    if (!user) {
      return res.status(401).json({
        message: "الحساب غير متاح.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export const requireManager = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      message: "لا تملكين صلاحية الوصول.",
    });
  }

  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      message: "لا تملكين صلاحية الوصول.",
    });
  }

  next();
};
