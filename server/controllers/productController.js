import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../models/productModel.js";

const invalidId = (id) => !Number.isSafeInteger(Number(id)) || Number(id) < 1;

export const listProducts = async (_req, res, next) => {
  try {
    res.json({ data: await getAllProducts() });
  } catch (error) { next(error); }
};

export const getProduct = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "معرّف المنتج غير صالح." });
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "المنتج غير موجود." });
    res.json({ data: product });
  } catch (error) { next(error); }
};

const validateProduct = (data, requireName = false) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "بيانات المنتج غير صالحة.";
  if (requireName && (typeof data.name !== "string" || !data.name.trim())) return "اسم المنتج مطلوب.";
  if (data.name !== undefined && (typeof data.name !== "string" || !data.name.trim())) return "اسم المنتج غير صالح.";
  if (data.price !== undefined && data.price !== null && (!Number.isFinite(Number(data.price)) || Number(data.price) < 0)) return "السعر يجب أن يكون رقمًا موجبًا أو صفرًا.";
  if (data.colors !== undefined && !Array.isArray(data.colors)) return "الألوان يجب أن تكون قائمة.";
  if (data.sizes !== undefined && !Array.isArray(data.sizes)) return "المقاسات يجب أن تكون قائمة.";
  if (data.productType !== undefined && !["sale", "rental", "both"].includes(data.productType)) return "نوع المنتج غير صالح.";
  if (data.status !== undefined && !["active", "unavailable", "archived"].includes(data.status)) return "حالة المنتج غير صالحة.";
  return null;
};

export const addProduct = async (req, res, next) => {
  try {
    const message = validateProduct(req.body, true);
    if (message) return res.status(400).json({ message });
    res.status(201).json({ data: await createProduct(req.body) });
  } catch (error) { next(error); }
};

export const editProduct = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "معرّف المنتج غير صالح." });
    const message = validateProduct(req.body);
    if (message) return res.status(400).json({ message });
    const product = await updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "المنتج غير موجود." });
    res.json({ data: product });
  } catch (error) { next(error); }
};

export const removeProduct = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "معرّف المنتج غير صالح." });
    if (!await deleteProduct(req.params.id)) return res.status(404).json({ message: "المنتج غير موجود." });
    res.status(204).send();
  } catch (error) { next(error); }
};
