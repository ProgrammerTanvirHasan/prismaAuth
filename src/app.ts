import express from "express";
import { postRouter } from "./modules/post/post.router";
const app = express()
app.use(express.json()) //app.use(express.json()) মানে হলো — সার্ভারে আসা JSON ডেটাকে পড়ে জাভাস্ক্রিপ্ট অবজেক্টে রূপান্তর করা।console.log(req.body);  // { name: 'Rahim', age: 25 } এমন আসবে.eta use na korle undefined ashto


app.use("/post",postRouter)
app.get('/', (req, res) => {
  res.send('Hello prisma!')
})

export default app;