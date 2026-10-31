import { Router } from "express";
import {
  addJobApplication,
  editJobApplication,
  getJobApplication,
  listJobApplications,
  removeJobApplication,
} from "../controllers/jobApplicationController.js";
import { requireAuth, requireManager } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, requireManager, listJobApplications);
router.post("/", addJobApplication);
router.get("/:id", requireAuth, requireManager, getJobApplication);
router.put("/:id", requireAuth, requireManager, editJobApplication);
router.delete("/:id", requireAuth, requireManager, removeJobApplication);

export default router;
