// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query as any;
  const queryString = new URLSearchParams(query).toString();

  try {
    const response = await axios.get(
      `https://fakerapi.it/api/v1/users?${queryString}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch data",
      details: error instanceof Error ? error.message : error,
    });
  }
};

export default handler;
