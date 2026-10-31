import {
  createWholesaleOrder,
  deleteWholesaleOrder,
  getAllWholesaleOrders,
  getWholesaleOrderById,
  updateWholesaleOrder,
} from "../models/wholesaleModel.js";

const invalidId = (id) =>
  !Number.isSafeInteger(Number(id)) || Number(id) < 1;

const orderTypes = ["sample", "wholesale"];

const deliveryMethods = ["pickup", "delivery"];

const statuses = [
  "new",
  "reviewing",
  "confirmed",
  "preparing",
  "completed",
  "cancelled",
];

const parseVariants = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    throw new Error("تفاصيل الألوان والمقاسات غير صالحة.");
  }

  try {
    const variants = JSON.parse(value);
    if (!Array.isArray(variants)) {
      throw new Error("expected an array");
    }
    return variants;
  } catch {
    throw new Error("تفاصيل الألوان والمقاسات غير صالحة.");
  }
};

const validationError = (data, creating = false) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "بيانات الطلب غير صالحة.";
  }

  if (creating) {
    const required = [
      "fullName",
      "phone",
      "nationalId",
      "orderType",
      "size",
      "deliveryMethod",
    ];

    if (
      required.some(
        (field) =>
          typeof data[field] !== "string" ||
          !data[field].trim()
      )
    ) {
      return "يرجى تعبئة الحقول المطلوبة.";
    }

    if (
      typeof data.description !== "string" ||
      !data.description.trim()
    ) {
      return "يرجى وصف التصميم المطلوب.";
    }

    if (
      data.quantity === undefined ||
      !Number.isSafeInteger(Number(data.quantity)) ||
      Number(data.quantity) < 1
    ) {
      return "الكمية يجب أن تكون عددًا صحيحًا موجبًا.";
    }

    if (
      !Array.isArray(data.variants) ||
      data.variants.length === 0 ||
      data.variants.some(
        (variant) =>
          !variant ||
          typeof variant.color !== "string" ||
          !variant.color.trim() ||
          typeof variant.size !== "string" ||
          !variant.size.trim() ||
          typeof variant.age !== "string" ||
          !variant.age.trim() ||
          !Number.isSafeInteger(Number(variant.quantity)) ||
          Number(variant.quantity) < 1
      )
    ) {
      return "يرجى تحديد اللون والمقاس والعمر والكمية لكل صنف.";
    }
  }

  if (
    data.orderType !== undefined &&
    !orderTypes.includes(data.orderType)
  ) {
    return "نوع الطلب غير صالح.";
  }

  if (
    data.deliveryMethod !== undefined &&
    !deliveryMethods.includes(data.deliveryMethod)
  ) {
    return "طريقة الاستلام غير صالحة.";
  }

  if (
    data.status !== undefined &&
    !statuses.includes(data.status)
  ) {
    return "حالة الطلب غير صالحة.";
  }

  if (
    data.quantity !== undefined &&
    (!Number.isSafeInteger(Number(data.quantity)) ||
      Number(data.quantity) < 1)
  ) {
    return "الكمية يجب أن تكون عددًا صحيحًا موجبًا.";
  }

  return null;
};

const toDatabaseOrder = (data, current = {}) => ({
  full_name: data.fullName ?? current.full_name ?? null,

  phone: data.phone ?? current.phone ?? null,

  national_id: data.nationalId ?? current.national_id ?? null,

  order_type: data.orderType ?? current.order_type ?? "wholesale",

  product_name: data.productName ?? current.product_name ?? null,

  description: data.description ?? current.description ?? null,

  quantity:
    data.quantity === undefined
      ? current.quantity ?? 1
      : Number(data.quantity),

  size: data.size ?? current.size ?? null,

  color: data.color ?? current.color ?? null,

  variants:
    data.variants === undefined
      ? current.variants ?? null
      : JSON.stringify(data.variants),

  delivery_method:
    data.deliveryMethod ?? current.delivery_method ?? "pickup",

  wilaya: data.wilaya ?? current.wilaya ?? null,

  commune: data.commune ?? current.commune ?? null,

  address: data.address ?? current.address ?? null,

  notes: data.notes ?? current.notes ?? null,

  status: data.status ?? current.status ?? "new",

  design_image:
    data.designImage ?? current.design_image ?? null,
});

export const listWholesaleOrders = async (_req, res, next) => {
  try {
    const orders = await getAllWholesaleOrders();

    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
};

export const getWholesaleOrder = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) {
      return res.status(400).json({
        message: "معرّف الطلب غير صالح.",
      });
    }

    const order = await getWholesaleOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "طلب الجملة غير موجود.",
      });
    }

    res.json({ data: order });
  } catch (error) {
    next(error);
  }
};

export const addWholesaleOrder = async (req, res, next) => {
  try {
    const body = req.body || {};
    let variants;

    try {
      variants = parseVariants(body.variants);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    // تحويل قيم الواجهة إلى القيم المقبولة في MySQL
    const submittedType = body.orderType || body.trialOption;

    const orderTypeMap = {
      trial: "sample",
      direct: "wholesale",
      sample: "sample",
      wholesale: "wholesale",
    };

    const data = {
      ...body,
      variants,
      orderType: orderTypeMap[submittedType],
      quantity: variants
        ? variants.reduce(
            (sum, variant) => sum + Number(variant.quantity || 0),
            0
          )
        : body.quantity,
      size: variants?.[0]?.size ?? body.size,
      color: variants?.[0]?.color ?? body.color,
      designImage: req.file
        ? `/uploads/wholesale/${req.file.filename}`
        : null,
    };

    const message = validationError(data, true);

    if (message) {
      return res.status(400).json({ message });
    }

    const order = await createWholesaleOrder(
      toDatabaseOrder(data)
    );

    res.status(201).json({
      message: "تم تسجيل طلب الجملة بنجاح.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const editWholesaleOrder = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) {
      return res.status(400).json({
        message: "معرّف الطلب غير صالح.",
      });
    }

    const current = await getWholesaleOrderById(req.params.id);

    if (!current) {
      return res.status(404).json({
        message: "طلب الجملة غير موجود.",
      });
    }

    const body = req.body || {};
    let variants;

    try {
      variants = parseVariants(body.variants);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const submittedType = body.orderType || body.trialOption;

    const orderTypeMap = {
      trial: "sample",
      direct: "wholesale",
      sample: "sample",
      wholesale: "wholesale",
    };

    const data = { ...body, variants };

    if (variants) {
      data.quantity = variants.reduce(
        (sum, variant) => sum + Number(variant.quantity || 0),
        0
      );
      data.size = variants[0]?.size;
      data.color = variants[0]?.color;
    }

    if (submittedType) {
      data.orderType = orderTypeMap[submittedType];
    }

    if (req.file) {
      data.designImage = `/uploads/wholesale/${req.file.filename}`;
    }

    const message = validationError(data);

    if (message) {
      return res.status(400).json({ message });
    }

    const updatedOrder = await updateWholesaleOrder(
      req.params.id,
      toDatabaseOrder(data, current)
    );

    res.json({ data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

export const removeWholesaleOrder = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) {
      return res.status(400).json({
        message: "معرّف الطلب غير صالح.",
      });
    }

    const deleted = await deleteWholesaleOrder(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "طلب الجملة غير موجود.",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
