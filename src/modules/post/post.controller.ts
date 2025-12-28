import type { Request, Response } from "express"
import { postService } from "./post.service"



const createPost=async (req:Request,res:Response)=>{
  try {
    const result =await postService.createPost(req.body)
    res.status(201).send(result)
  } catch (error) {
   res.status(400).send(error)

  }
}
export const postController={
    createPost
}