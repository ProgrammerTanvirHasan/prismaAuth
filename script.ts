import { prisma } from "./src/lib/prisma";

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      id: "tttt",
      name: "tanvir",
      email: "tanvir@prisma.io",
      posts: {
        create: {
          title: "Hello World boss",
          content: "This is my second post!",
          published: true,
        },
      },
    },
    include: {
      posts: true,
    },
  });
  console.log("Created user:", user);

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
