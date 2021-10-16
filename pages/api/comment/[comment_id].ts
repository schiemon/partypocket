import { NextApiRequest, NextApiResponse } from "next";
import {comment} from "postcss";

type Comment_Id = Number;

type CommentParams = {
  comment_id: Comment_Id
}

type CommentApiRequest = NextApiRequest & {
  query: CommentParams
}

export default function handler(req: CommentApiRequest, res: NextApiResponse): void {
  let comment_id = req.query.comment_id;

  if (comment_id > 20)
    comment_id = 42;

  console.log("This is a logging message.")

  res.status(200).json({ "id": comment_id, "x": 23 });
}