import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer  from "nodemailer";



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
   
    }),
    trustedOrigins:[process.env.APP_URL!],
    user:{
       additionalFields:{
        role:{
          type:"string",
          defaultValue:"USER",
          required:false

        },
        phone:{
          type:"string",
          required:false
        }

       }
    },
          emailAndPassword: { 
    enabled: true, 
    autoSignIn:false,
    requireEmailVerification:true
  },


  emailVerification: {
    sendOnSignUp:true,
     autoSignInAfterVerification: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
           
     try {
      const verificationURL=`${process.env.APP_URL}/verify-email?token=${token}`
         const info = await transporter.sendMail({
    from: '"prismaBlog" <prisma@gmail.com>',
    to:user.email,
    subject: "Verify your email",
    text: "Hello world?", 
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .header {
        background-color: #2563eb;
        color: #ffffff;
        padding: 24px;
        text-align: center;
      }
      .content {
        padding: 32px;
        color: #333333;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        margin: 24px 0;
        padding: 14px 28px;
        background-color: #2563eb;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        padding: 20px;
        font-size: 12px;
        color: #777777;
        text-align: center;
        background-color: #f9fafb;
      }
      .link {
        word-break: break-all;
        color: #2563eb;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>{{Prisma Blog}}</h1>
      </div>

      <!-- Content -->
      <div class="content">
      <h1>hello ${user.name}</h1>
        <h2>Verify your email address</h2>
        <p>
          Thanks for signing up! Please confirm your email address by clicking
          the button below.
        </p>

        <a href="${verificationURL}" class="button">Verify Email</a>

        <p>
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p class="link">${url}</p>

        <p>
          This link will expire soon. If you didn’t create an account, you can
          safely ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>© {{Prisma Blog}}. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`
  });

     } catch (error) {
       throw error;
     }
 
    },
  },
  socialProviders: {
        google: { 
           prompt: "select_account", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
             accessType: "offline", 
        
        }, 
    },

});