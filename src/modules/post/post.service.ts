import {
  CommentsStatus,
  PostStatus,
  type Post,
} from "../../../generated/prisma/client";
import type { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getUsers = async () => {
  const result = await prisma.post.findMany();
  return result;
};

const getPostById = async (postId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    }); //transaction use korar ortho hocce eikhane update and find 2 tay thik thakle kbl output debe.jodi kuno ekta error hoi tobe baki ektar output return korbena
    const uniqeId = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            status: CommentsStatus.APPROVED,
            parentId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            replies: {
              orderBy: {
                createdAt: "asc",
              },
              where: {
                status: CommentsStatus.APPROVED,
              },
              include: {
                replies: true,
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return uniqeId;
  });
  return result;
};
////////////////////////////////////////////////////////////////////////////////////////////

const getTitle = async ({
  search, //payload
  tags, //payload
  isFeatured,
  status,
  authorId,
  page,
  limit,
  shortBy, //{asc or dsc}
  shortOrder, //{title or other field}
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  shortBy: string | undefined;
  shortOrder: string | undefined;
}) => {
  const allValue: PostWhereInput[] = []; //allValue variable a shudhu true value gula add hobe karon and condition kokhono false value er shathe hoina tay jodi search er value thake and tags er value thake tobei kbl allValue te add hobe ekhon and condition chalano easy
  if (search) {
    allValue.push({
      OR: [
        //first condition
        //OR er moddhe shob search er bishoy..mane search perameter ashle title,content and tags ke follow korbe
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        }, //title thoba content jkuno ektar shathe millei data diye debe
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string, //jehetu tags ekta array tay has diye query korte hobe
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    allValue.push({
      tags: {
        //second condition
        //tags perameter ashle ei logic ta implement hobe
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    allValue.push({ isFeatured });
  }
  if (status) {
    allValue.push({ status });
  }

  if (authorId) {
    allValue.push({ authorId });
  }
  const skip = (page - 1) * limit;
  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: allValue, //allValue te 2 ta condition er value ace..
      // and na dile 2ta condition true holei kbl value dito but and dewate 2 tar jkuno ekta perameter dilei shei onujay value return korbe
    },
    orderBy:
      shortBy && shortOrder
        ? {
            [shortOrder]: shortBy,
          }
        : { createdAt: "desc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: allValue,
    },
  });

  return {
    data: result,
    totalData: {
      total,
      page,
      limit,
    },
  };
};

const getMyPost = async (authorId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE", //USER er STATUS  jodi ACTIVE  na hoi tobe eikhan thekei return kore debe
    },
    select: {
      id: true,
    },
  });

  const myPost = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  const totalPost = await prisma.post.aggregate({
    //aggregate use kore count bebohar kora
    _count: {
      id: true,
    },
    where: {
      authorId,
    },
  });
  return {
    data: myPost,
    totalPost,
  };
};

const updateMyPost = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    ///admin jodi na hoi and user verify jodi thik na thake tahole kuno kicui update korte parbena
    throw new Error("u have not access");
  }

  if (!isAdmin) {
    delete data.isFeatured; //admin jodi na hoi mane jodi general user hoi tara isFeatured update hobena..er jonno delete kore debo.only admin user er isFeatuerd update korte parbe
  }

  const result = await prisma.post.update({
    where: {
      id: postData.id,
    },
    data,
  });

  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("u have not access");
  }
  return prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getStatistics = async () => {
  //post_count,published_post,draft_post,total_comments,total_views

  return await prisma.$transaction(async (tx) => {
    const [
      totoalPost,
      publishedPost,
      draftPost,
      totalComments,
      approvedComment,
      userCount,
      adminUser,
      totoalViews,
    ] = await Promise.all([
      //Promise.all use kore ekta array er moddhe shob gula variable ke shajiye nilam.
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.comments.count(),
      await tx.comments.count({
        where: {
          status: CommentsStatus.APPROVED,
        },
      }),
      await tx.user.count(),
      await tx.user.count({
        where: {
          role: "ADMIN",
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true, //jehetu individual shob post er sum view dekhte chay tay aggregate
        },
      }),
    ]);

    return {
      totoalPost,
      publishedPost,
      draftPost,
      totalComments,
      approvedComment,
      userCount,
      adminUser,
      totoalViews: totoalViews._sum.views,
    };
  });
};

export const postService = {
  createPost,
  getUsers,
  getTitle,
  getPostById,
  getMyPost,
  updateMyPost,
  deletePost,
  getStatistics,
};

//mainly ekhon kaj ta hobe jotogula conditon and er moddhe thakbe mane allValue array er moddhe thakbe shob gular moddho theke jkuno true holew sheitar condition onujay value ashbe abar ekadhik perameter o dewa jete pare pare .eivabei kaj cholbe.shob gula perameter ew value ashbe abar jkuno ekta perameter ew value ashbe etay AND er kaj
