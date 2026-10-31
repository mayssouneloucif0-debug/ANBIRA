
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { tailoringRouter } from "./routes/serviceOrderRoutes.js";
import { authRouter, usersRouter } from "./routes/userRoutes.js";
import wholesaleRoutes from "./routes/wholesaleRoutes.js";

const app = express();

app.use((req, _res, next) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  next();
});

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

/*
  السماح للواجهة بعرض صور المنتجات المرفوعة
*/
app.use(
  "/uploads",
  express.static("server/uploads")
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "ANBIRA API is running.",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tailoring-orders", tailoringRouter);
app.use("/api/wholesale-orders", wholesaleRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(
    `ANBIRA API running at http://localhost:${env.port}`
  );
});

