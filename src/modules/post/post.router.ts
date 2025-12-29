import express from "express";
import { postController } from "./post.controller";
import middleware, { userRole } from "../../middleware/auth";

const router = express.Router();

router.post("/", middleware(userRole.USER), postController.createPost);

export const postRouter = router;
