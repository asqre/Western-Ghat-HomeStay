import puppeteer from "puppeteer";

const defaultOptions = {
  format: "A4",
  printBackground: true,
};

async function htmlToPdf(html, options = defaultOptions) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf(options);

  return pdfBuffer;
}

export default htmlToPdf;
