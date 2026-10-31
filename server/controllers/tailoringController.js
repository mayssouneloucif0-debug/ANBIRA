import {
  getAllTailoringOrders,
  createTailoringOrder,
  deleteTailoringOrder,
} from "../models/tailoringOrderModel.js";

const invalidId = (id) =>
  !Number.isSafeInteger(Number(id)) || Number(id) < 1;

export const tailoringController = {
  list: async (_req, res, next) => {
    try {
      const orders = await getAllTailoringOrders();

      res.json({
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const {
        fullName,
        phone,
        nationalId,
        description,
        quantity,
        size,
        color,
        deliveryMethod,
        wilaya,
        commune,
        address,
        notes,
      } = req.body;

      if (
        !fullName?.trim() ||
        !phone?.trim() ||
        !nationalId?.trim() ||
        !description?.trim() ||
        !size ||
        !color?.trim() ||
        !deliveryMethod
      ) {
        return res.status(400).json({
          message: "يرجى ملء جميع الحقول المطلوبة.",
        });
      }

      if (!["pickup", "delivery"].includes(deliveryMethod)) {
        return res.status(400).json({
          message: "طريقة الاستلام غير صحيحة.",
        });
      }

      if (
        deliveryMethod === "delivery" &&
        (!wilaya?.trim() ||
          !commune?.trim() ||
          !address?.trim())
      ) {
        return res.status(400).json({
          message: "يرجى إدخال الولاية والبلدية والعنوان.",
        });
      }

      const parsedQuantity = Number(quantity || 1);

      if (
        !Number.isInteger(parsedQuantity) ||
        parsedQuantity < 1
      ) {
        return res.status(400).json({
          message: "الكمية يجب أن تكون عددًا صحيحًا أكبر من صفر.",
        });
      }

      const order = await createTailoringOrder({
        fullName,
        phone,
        nationalId,
        description,
        quantity: parsedQuantity,
        size,
        color,
        deliveryMethod,
        wilaya: deliveryMethod === "delivery" ? wilaya : null,
        commune: deliveryMethod === "delivery" ? commune : null,
        address: deliveryMethod === "delivery" ? address : null,
        notes,
        designImage: req.file
          ? `/uploads/tailoring/${req.file.filename}`
          : null,
      });

      res.status(201).json({
        message: "تم استلام طلب الخياطة بنجاح.",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    try {
      if (invalidId(req.params.id)) {
        return res.status(400).json({
          message: "معرّف الطلب غير صالح.",
        });
      }

      const deleted = await deleteTailoringOrder(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          message: "طلب الخياطة غير موجود.",
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};