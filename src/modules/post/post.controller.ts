import type { Request, Response } from "express";
import { postService } from "./post.service";
import type { PostStatus } from "../../../generated/prisma/enums";

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

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await postService.getUsers();
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getByTitle = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;

    let isFeatured: boolean | undefined;

    if (req.query.isFeatured === "true") {
      isFeatured = true;
    } else if (req.query.isFeatured === "false") {
      isFeatured = false;
    } else {
      isFeatured = undefined;
    }

    const result = await postService.getTitle({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
    });
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const postController = {
  createPost,
  getAllUser,
  getByTitle,
};
