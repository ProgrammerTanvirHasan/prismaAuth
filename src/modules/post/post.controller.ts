import type { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
     return;
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const postController = {
  createPost,
};
