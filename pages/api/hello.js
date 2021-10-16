// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const { comment_id } = req.query;

  res.status(200).json({ "id": comment_id });
}
