export default function errorHandler(err, req, res, next) {
  console.error(err);

  // prisma known errors
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  } else if (err.code === "P1001") {
    return res.status(404).json({ error: "Database is Off" });
  }

  const status = err.status || 500;
  const message = status === 500 ? "Internal Server Error" : err.message;

  return res.status(status).json({ error: message });
}
