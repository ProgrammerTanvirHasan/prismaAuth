import express from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
const app = express()
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(cors({
origin:process.env.APP_URL || "http://localhost:5000",
credentials:true
}))
app.use(express.json()) //app.use(express.json()) মানে হলো — সার্ভারে আসা JSON ডেটাকে পড়ে জাভাস্ক্রিপ্ট অবজেক্টে রূপান্তর করা।console.log(req.body);  // { name: 'Rahim', age: 25 } এমন আসবে.eta use na korle undefined ashto


app.use("/post",postRouter)
app.get('/', (req, res) => {
  res.send('Hello prisma!')
})

export default app;