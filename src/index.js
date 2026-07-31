import "dotenv/config";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import notesRouter from "./routes/notes.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import authMidlleware from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";

const PORT = process.env.PORT;

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max 100 request per window
  message: { error: "Too many requests, slow down buddy" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // max 100 request per window
  message: { error: "Too many requests, please try again later" },
});

const app = express();

app.use(globalLimiter);
app.use(morgan("dev"));

app.use(express.json());

// app.set("strict routing", false);

app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

app.use("/notes", authMidlleware, notesRouter);

app.use("/auth", authLimiter, authRouter);

app.use("/admin", authMidlleware, adminRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
