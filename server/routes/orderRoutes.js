import { Router } from "express";
import { addOrder, editOrder, getOrder, listOrders, removeOrder } from "../controllers/orderController.js";
import { validateOrder } from "../middleware/validateOrder.js";
import { requireAuth, requireManager } from "../middleware/auth.js";

const router = Router();

router.get("/", listOrders);
router.get("/:id", getOrder);
router.post("/", validateOrder, addOrder);
router.patch("/:id", editOrder);
router.delete("/:id", requireAuth, requireManager, removeOrder);

export default router;
