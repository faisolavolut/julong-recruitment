import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { htmlContent } = req.body;

    try {
      // Launch browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set HTML content
      await page.setContent(htmlContent, {
        waitUntil: "networkidle0", // Tunggu hingga semua resource selesai dimuat
      });

      // Generate PDF
      const pdf = await page.pdf({
        format: "A4", // Ukuran halaman
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" }, // Margin
        printBackground: true, // Sertakan background
      });

      // Tutup browser
      await browser.close();

      // Kirim PDF sebagai respons
      res.setHeader("Content-Type", "application/pdf");
      res.send(pdf);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
