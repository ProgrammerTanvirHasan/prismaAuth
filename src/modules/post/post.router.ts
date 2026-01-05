import express from "express";
import { postController } from "./post.controller";
import middleware, { userRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", postController.getAllUser);

router.get("/:postId", postController.getPostById);
router.post("/", middleware(userRole.USER), postController.createPost);

export const postRouter = router;

