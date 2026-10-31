import { createJob, deleteJob, getAllJobs, getJobById, updateJob } from "../models/jobModel.js";

const invalidId = (id) => !Number.isSafeInteger(Number(id)) || Number(id) < 1;
const validStatuses = ["open", "closed"];

const validationError = (data, creating = false) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "بيانات الوظيفة غير صالحة.";
  if (creating && (typeof data.title !== "string" || !data.title.trim())) return "عنوان الوظيفة مطلوب.";
  if (data.title !== undefined && (typeof data.title !== "string" || !data.title.trim())) return "عنوان الوظيفة غير صالح.";
  if (data.status !== undefined && !validStatuses.includes(data.status)) return "حالة الوظيفة غير صالحة.";
  return null;
};

export const listJobs = async (_req, res, next) => {
  try { res.json({ data: await getAllJobs() }); } catch (error) { next(error); }
};

export const getJob = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "معرّف الوظيفة غير صالح." });
    const job = await getJobById(req.params.id);
    if (!job) return res.status(404).json({ message: "الوظيفة غير موجودة." });
    res.json({ data: job });
  } catch (error) { next(error); }
};

export const addJob = async (req, res, next) => {
  try {
    const message = validationError(req.body, true);
    if (message) return res.status(400).json({ message });
    res.status(201).json({ data: await createJob({ ...req.body, title: req.body.title.trim() }) });
  } catch (error) { next(error); }
};

export const editJob = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "معرّف الوظيفة غير صالح." });
    const message = validationError(req.body);
    if (message) return res.status(400).json({ message });
    const current = await getJobById(req.params.id);
    if (!current) return res.status(404).json({ message: "الوظيفة غير موجودة." });
    const job = await updateJob(req.params.id, {
      title: req.body.title?.trim() || current.title,
      description: req.body.description ?? current.description,
      requirements: req.body.requirements ?? current.requirements,
      status: req.body.status ?? current.status,
    });
    res.json({ data: job });
  } catch (error) { next(error); }
};

export const removeJob = async (req, res, next) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "معرّف الوظيفة غير صالح." });
    if (!await deleteJob(req.params.id)) return res.status(404).json({ message: "الوظيفة غير موجودة." });
    res.status(204).send();
  } catch (error) { next(error); }
};
