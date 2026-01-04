import { PostStatus, type Post } from "../../../generated/prisma/client";
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

export const postService = {
  createPost,
  getUsers,
  getTitle,
  getPostById,
};

//mainly ekhon kaj ta hobe jotogula conditon and er moddhe thakbe mane allValue array er moddhe thakbe shob gular moddho theke jkuno true holew sheitar condition onujay value ashbe abar ekadhik perameter o dewa jete pare pare .eivabei kaj cholbe.shob gula perameter ew value ashbe abar jkuno ekta perameter ew value ashbe etay AND er kaj
