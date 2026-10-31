import {
  createJobApplication,
  deleteJobApplication,
  getAllJobApplications,
  getJobApplicationById,
  updateJobApplicationStatus,
} from "../models/jobApplicationModel.js";
import { getJobById } from "../models/jobModel.js";

const invalidId = (id) => !Number.isSafeInteger(Number(id)) || Number(id) < 1;
const statuses = ["new", "reviewing", "accepted", "rejected"];

export const listJobApplications = async (_req, res, next) => {
  try { res.json({ data: await getAllJobApplications() }); } catch (error) { next(error); }
};

export const getJobApplication = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "معرّف الطلب غير صالح." });
    const application = await getJobApplicationById(req.params.id);
    if (!application) return res.status(404).json({ message: "طلب التوظيف غير موجود." });
    res.json({ data: application });
  } catch (error) { next(error); }
};

export const addJobApplication = async (req, res, next) => {
  try {
    const { jobId, firstName, lastName, nationalId, phone } = req.body || {};
    const requiredValues = [firstName, lastName, nationalId, phone];
    if (invalidId(jobId) || requiredValues.some((value) => typeof value !== "string" || !value.trim())) {
      return res.status(400).json({ message: "الوظيفة والاسم واللقب ورقم البطاقة والهاتف حقول مطلوبة." });
    }
    const job = await getJobById(jobId);
    if (!job || job.status !== "open") return res.status(400).json({ message: "الوظيفة المختارة غير متاحة." });
    const application = await createJobApplication({
      job_id: Number(jobId),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      national_id: nationalId.trim(),
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      phone: phone.trim(),
      email: req.body.email || null, experience: req.body.experience || null,
      message: req.body.message || null, cv_file: req.body.cvFile || null,
    });
    res.status(201).json({ data: application });
  } catch (error) { next(error); }
};

export const editJobApplication = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "معرّف الطلب غير صالح." });
    if (!statuses.includes(req.body?.status)) return res.status(400).json({ message: "حالة الطلب غير صالحة." });
    if (!await getJobApplicationById(req.params.id)) return res.status(404).json({ message: "طلب التوظيف غير موجود." });
    res.json({ data: await updateJobApplicationStatus(req.params.id, req.body.status) });
  } catch (error) { next(error); }
};

export const removeJobApplication = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "معرّف الطلب غير صالح." });
    if (!await deleteJobApplication(req.params.id)) return res.status(404).json({ message: "طلب التوظيف غير موجود." });
    res.status(204).send();
  } catch (error) { next(error); }
};
