import type { Request, Response } from "express"
import { postService } from "./post.service"
import type { Post } from "../../../generated/prisma/client"


const createPost=async (req:Request,res:Response)=>{
  try {
    const result =await postService.createPost(req.body)
    req.status(201).send(result)
  } catch (error) {
    console.log(error)
  }
}
export const postController={
    createPost
}