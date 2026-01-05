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

export default {
  createComment,
};
