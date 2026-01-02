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
////////////////////////////////////////////////////////////////////////////////////////////

const getTitle = async ({
  search, //payload
  tags, //payload
  isFeatured,
  status,
  authorId,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
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

  const result = await prisma.post.findMany({
    where: {
      AND: allValue, //allValue te 2 ta condition er value ace..
      // and na dile 2ta condition true holei kbl value dito but and dewate 2 tar jkuno ekta perameter dilei shei onujay value return korbe
    },
  });

  return result;
};

export const postService = {
  createPost,
  getUsers,
  getTitle,
};

//mainly ekhon kaj ta hobe jotogula conditon and er moddhe thakbe mane allValue array er moddhe thakbe shob gular moddho theke jkuno true holew sheitar condition onujay value ashbe abar ekadhik perameter o dewa jete pare pare .eivabei kaj cholbe.shob gula perameter ew value ashbe abar jkuno ekta perameter ew value ashbe etay AND er kaj
