import express from "express";
import requireRole from "../middleware/role.js";
import * as adminController from "../controller/admin.js";

const router = express.Router();

router.get("/notes", requireRole("admin"), adminController.getAllNotesAdmin);

export default router;
