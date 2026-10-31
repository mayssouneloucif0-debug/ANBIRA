import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "../models/orderModel.js";

export const listOrders = async (_req, res, next) => {
  try {
    const orders = await getAllOrders();

    res.json({
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "الطلب غير موجود.",
      });
    }

    res.json({
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const addOrder = async (req, res, next) => {
  try {
    const order = await createOrder({
      ...req.body,
      fullName: req.body.fullName.trim(),
      phone: req.body.phone.trim(),
      nationalId: req.body.nationalId.trim(),
    });

    res.status(201).json({
      message: "تم استلام الطلب بنجاح.",
      data: order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    next(error);
  }
};

export const editOrder = async (req, res, next) => {
  try {
    const order = await updateOrder(
      req.params.id,
      req.body
    );

    if (!order) {
      return res.status(404).json({
        message: "الطلب غير موجود.",
      });
    }

    res.json({
      message: "تم تحديث الطلب.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const removeOrder = async (req, res, next) => {
  try {
    const deleted = await deleteOrder(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "الطلب غير موجود.",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};