import type { Request, Response } from "express";
import commentService from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return;
    }
    req.body.authorId = user.id;
    const result = await commentService.createComment(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.getCommentById(commentId as string);
    return result;
  } catch (error) {
    console.log(error);
  }
};
const getCommentAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentService.getCommentById(authorId as string);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.deleteComment(
      commentId as string,
      user?.id as string
    );
    return result;
  } catch (error) {
    res.status(401).json({
      error: "delete Failed",
      details: error,
    });
  }
};
const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;

    const result = await commentService.updateComment(
      commentId as string,
      req.body,
      user?.id as string
    );
    return result;
  } catch (error) {
    res.status(401).json({
      error: "update Failed",
      details: error,
    });
  }
};

export default {
  createComment,
  getCommentById,
  getCommentAuthorId,
  deleteComment,
  updateComment,
};
