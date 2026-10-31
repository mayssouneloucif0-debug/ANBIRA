export const notFound = (req, res) => {
  res.status(404).json({
    message: `المسار غير موجود: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (error, _req, res, _next) => {
  console.error("=== ANBIRA SERVER ERROR ===");
  console.error(error);
  console.error("===========================");

  res.status(error.status || 500).json({
    message: error.message || "حدث خطأ غير متوقع في الخادم.",
  });
};