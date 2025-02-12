import express from "express";
import { createVideo, getVideos, getVideoById } from "../controllers/videoController.js";
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/create", auth, createVideo);
router.get("/all", auth, getVideos)
router.get("/:id", auth, getVideoById)

export default router;