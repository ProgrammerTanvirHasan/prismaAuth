import { prisma } from "../../lib/prisma";
import type { CommentsStatus } from "../../../generated/prisma/enums";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comments.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  const result = await prisma.comments.create({
    data: payload,
  });
  return result;
};

const getCommentById = async (commentId: string) => {
  const result = await prisma.comments.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};
const getCommentByAuthor = async (authorId: string) => {
  const result = await prisma.comments.findMany({
    where: {
      id: authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};

const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comments.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("NO POST TO DELETE");
  }

  const result = await prisma.comments.delete({
    where: {
      id: commentData.id,
    },
  });
  return result;
};

const updateComment = async (
  commentId: string,
  data: { content?: string; status?: CommentsStatus },
  authorId: string
) => {
  const commentData = await prisma.comments.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("NO COMMENT TO UPDATE");
  }

  const result = await prisma.comments.update({
    where: {
      id: commentId,
      authorId,
    },
    data,
  });
  return result;
};

const moderateUpdate = async (id: string, data: { status: CommentsStatus }) => {
  const commentData = await prisma.comments.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (commentData.status === data.status) {
    throw new Error(
      `ypour provided status (${data.status}) is already up to date`
    );
  }

  return await prisma.comments.update({
    where: {
      id,
    },
    data,
  });
};

export default {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateComment,
  moderateUpdate,
};
