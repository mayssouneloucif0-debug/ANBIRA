import { Router } from "express";
import { addJob, editJob, getJob, listJobs, removeJob } from "../controllers/jobController.js";
import { requireAuth, requireManager } from "../middleware/auth.js";

const router = Router();

router.get("/", listJobs);
router.post("/", requireAuth, requireManager, addJob);
router.get("/:id", getJob);
router.put("/:id", requireAuth, requireManager, editJob);
router.delete("/:id", requireAuth, requireManager, removeJob);

export default router;
