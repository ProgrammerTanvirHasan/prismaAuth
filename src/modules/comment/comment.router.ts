import express from "express";
import commentController from "./comment.controller";

import auth, { userRole } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth(userRole.ADMIN, userRole.USER),
  commentController.createComment
);

router.get("/:commentId", commentController.getCommentById);
router.get("/author/:authorId", commentController.getCommentAuthorId);
router.delete(
  "/:commentId",
  auth(userRole.ADMIN, userRole.USER),
  commentController.deleteComment
);
router.patch(
  "/:commentId",
  auth(userRole.ADMIN, userRole.USER),
  commentController.updateComment
);

export const commentRouter = router;
