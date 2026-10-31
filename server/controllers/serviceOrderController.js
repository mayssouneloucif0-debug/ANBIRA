import db from "../config/database.js";

const definitions = {
  tailoring: {
    table: "tailoring_orders",
    required: ["fullName", "phone"],
    fields: { fullName: "customer_name", phone: "phone", designImage: "design_image", modelDescription: "model_description", size: "size", color: "color", quantity: "quantity", deliveryMethod: "delivery_method", wilaya: "wilaya", commune: "commune", address: "address", notes: "notes" },
  },
  wholesale: {
    table: "wholesale_orders",
    required: ["fullName", "phone", "productDesign", "quantity"],
    fields: { fullName: "customer_name", phone: "phone", productDesign: "product_design", quantity: "quantity", size: "size", details: "details" },
  },
};

const createController = (type) => {
  const definition = definitions[type];
  const columns = Object.values(definition.fields);
  const values = Object.keys(definition.fields);

  return {
    list: (_req, res) => res.json({ data: db.prepare(`SELECT * FROM ${definition.table} ORDER BY id DESC`).all() }),
    create: (req, res) => {
      const missing = definition.required.find((field) => !req.body[field]);
      if (missing) return res.status(400).json({ message: `الحقل ${missing} مطلوب.` });
      const result = db.prepare(`INSERT INTO ${definition.table} (${columns.join(", ")}) VALUES (${values.map((field) => `@${field}`).join(", ")})`).run(
        Object.fromEntries(values.map((field) => [field, field === "quantity" ? Number(req.body[field] || 1) : req.body[field] || null])),
      );
      const order = db.prepare(`SELECT * FROM ${definition.table} WHERE id = ?`).get(result.lastInsertRowid);
      res.status(201).json({ message: "تم استلام الطلب بنجاح.", data: order });
    },
  };
};

export const tailoringOrders = createController("tailoring");
export const wholesaleOrders = createController("wholesale");
