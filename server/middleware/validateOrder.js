import { getProductById } from "../models/productModel.js";

export const validateOrder = async (req, res, next) => {
  const {
    fullName,
    phone,
    nationalId,
    productId,
    quantity,
    orderType,
  } = req.body;

  if (
    typeof fullName !== "string" ||
    !fullName.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof nationalId !== "string" ||
    !nationalId.trim() ||
    !productId
  ) {
    return res.status(400).json({
      message: "الاسم ورقم الهاتف ورقم بطاقة التعريف والمنتج حقول مطلوبة.",
    });
  }

  try {
    const product = await getProductById(productId);

    if (!product) {
      return res.status(400).json({ message: "المنتج المختار غير صالح." });
    }

    const selectedOrderType =
      orderType || (product.product_type === "both" ? "" : product.product_type);
    const allowedOrderTypes =
      product.product_type === "both"
        ? ["sale", "rental"]
        : [product.product_type];

    if (!allowedOrderTypes.includes(selectedOrderType)) {
      return res.status(400).json({ message: "نوع الطلب لا يتوافق مع المنتج." });
    }

    req.body.orderType = selectedOrderType;
  } catch (error) { return next(error); }

  if (!["sale", "rental"].includes(req.body.orderType)) {
    return res.status(400).json({ message: "نوع الطلب غير صالح." });
  }

  if (quantity !== undefined && (!Number.isInteger(Number(quantity)) || Number(quantity) < 1)) {
    return res.status(400).json({ message: "الكمية يجب أن تكون رقماً أكبر من صفر." });
  }

  next();
};
