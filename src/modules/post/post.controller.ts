import type { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import type { PostStatus } from "../../../generated/prisma/enums";
import { userRole } from "../../middleware/auth";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req, "req");
  try {
    const user = req.user;
    if (!user) {
      return;
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await postService.getUsers();
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const result = await postService.getPostById(postId as string);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const getByTitle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const shortBy = req.query.shortBy as string | undefined;
    const shortOrder = req.query.shortOrder as string | undefined;

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
      page,
      limit,
      shortBy,
      shortOrder,
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("unAthorized");
    }

    const result = await postService.getMyPost(user?.id as string);
    res.send(result);
  } catch (error) {
    next(error);
  }
};
const updateMyPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("invalid");
    }
    const { postId } = req.params;

    const isAdmin = user.role === userRole.ADMIN;

    const result = await postService.updateMyPost(
      postId as string,
      req.body,
      user.id,
      isAdmin
    );
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("invalid");
    }
    const { postId } = req.params;
    const isAdmin = user.role === userRole.ADMIN;
    const result = await postService.deletePost(
      postId as string,
      user.id,
      isAdmin as boolean
    );
    res.send(result);
  } catch (error) {
    next(error);
  }
};
const getStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await postService.getStatistics();
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const postController = {
  createPost,
  getAllUser,
  getByTitle,
  getPostById,
  getMyPosts,
  updateMyPosts,
  deletePost,
  getStatistics,
};
