// pages/api/set-cookie.ts
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0), // Tanggal kedaluwarsa di masa lalu
        path: "/",
      })
    );

    res.status(200).json({ message: "Cookie dihapus" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
