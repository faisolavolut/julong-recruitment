import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { htmlContent } = req.body;

    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      const pdf = await page.pdf({ format: "A4" });
      await browser.close();
      res.setHeader("Content-Type", "application/pdf");
      res.send(pdf);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      res
        .status(500)
        .json({ error: "Failed to generate PDF", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
