import { prisma } from "../lib/prisma";
import { userRole } from "../middleware/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "admin1 vai",
      email: "admin1@email.com",
      password: "admin123",
      role: userRole.ADMIN,
    };

    const hasAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (hasAdmin) {
      throw new Error("user already exist");
    }
    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
    if (signUpAdmin.ok) {
      const update = await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log(update, "emailverify");
    }
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
