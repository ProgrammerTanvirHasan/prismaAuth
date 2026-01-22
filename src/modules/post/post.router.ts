import express from "express";
import { postController } from "./post.controller";
import middleware, { userRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", postController.getAllUser);
router.get("/status", middleware(userRole.ADMIN), postController.getStatistics);

router.get("/:postId", postController.getPostById);
router.get(
  "/my-post",
  middleware(userRole.USER, userRole.ADMIN),
  postController.getMyPosts,
);
router.post(
  "/",
  middleware(userRole.USER, userRole.ADMIN),
  postController.createPost,
);
router.patch(
  "/:postId",
  middleware(userRole.USER, userRole.ADMIN),
  postController.updateMyPosts,
);
router.delete(
  "/:postId",
  middleware(userRole.USER, userRole.ADMIN),
  postController.deletePost,
);

export const postRouter = router;
