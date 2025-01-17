import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { token } = req.body;
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600 * 24, // Expired dalam 1 jam
        path: "/",
      })
    );

    res.status(200).json({ message: "JWT disimpan di cookie" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
