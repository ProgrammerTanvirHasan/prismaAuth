import express from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.router";
import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
const app = express();
app.all("/api/auth/*splat", toNodeHandler(auth)); //splat হলো এমন একটা dynamic parameter যা /api/auth/ এর পরে যা কিছুই আসুক না কেন, সবকিছুকে ধরে ফেলে।must dite hobe
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:5000",
    credentials: true,
  })
);
app.use(express.json()); //app.use(express.json()) মানে হলো — সার্ভারে আসা JSON ডেটাকে পড়ে জাভাস্ক্রিপ্ট অবজেক্টে রূপান্তর করা।console.log(req.body);  // { name: 'Rahim', age: 25 } এমন আসবে.eta use na korle undefined ashto

app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.get("/", (req, res) => {
  res.send("Hello prisma!");
});
app.use(notFound);
app.use(errorHandler);

export default app;

// server.ts a shudhu ekta async function hobe jekhane prisma connet kora hobe try catch er moddhe r baki shob express,cors app declare shobhobe app.ts file a
