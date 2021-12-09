import express from "express";
import dream from "../controllers/dream.js";
import auth from "../middlewares/auth.js";
import validId from "../middlewares/validId.js";
import formatFile from "../middlewares/formatFile.js";
import multiparty from "connect-multiparty";
const mult = multiparty();
const router = express.Router();

router.post("/saveDream", auth, dream.saveDream);
router.post("/saveDreamImg", mult, formatFile, auth, dream.saveDreamImg);
router.get("/listDream", auth, dream.listDream);
router.put("/updateDream", auth, dream.updateDream);
router.delete("/deleteDream/:_id", auth, validId, dream.deleteDream);

export default router;
