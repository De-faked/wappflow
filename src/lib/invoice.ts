import { PDFDocument, StandardFonts } from "pdf-lib";

type InvoiceInput = {
  businessName: string;
  currency: string;
  orderNo: number;
  customerName: string;
  customerPhone: string;
  items: { name: string; qty: number; unitPrice: number }[];
  total: number;
  issuedAtISO: string;
};

export async function buildInvoicePdf(input: InvoiceInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const margin = 48;
  let y = 800;

  const drawText = (text: string, size = 12, bold = false) => {
    page.drawText(text, { x: margin, y, size, font: bold ? fontBold : font });
    y -= size + 6;
  };

  drawText("INVOICE", 20, true);
  drawText(`Business: ${input.businessName}`, 12);
  drawText(`Order #: ${input.orderNo}`, 12);
  drawText(`Issued: ${input.issuedAtISO}`, 12);

  y -= 10;
  drawText(`Customer: ${input.customerName}`, 12, true);
  drawText(`Phone: ${input.customerPhone}`, 12);

  y -= 14;
  drawText("Items:", 12, true);

  for (const it of input.items) {
    const lineTotal = it.qty * it.unitPrice;
    drawText(`- ${it.name} | qty: ${it.qty} | unit: ${it.unitPrice.toFixed(2)} | total: ${lineTotal.toFixed(2)}`, 11);
  }

  y -= 10;
  drawText(`TOTAL: ${input.total.toFixed(2)} ${input.currency}`, 14, true);

  y -= 18;
  drawText("Payment:", 12, true);
  drawText("Please reply with a payment receipt screenshot after transfer.", 11);

  const bytes = await pdf.save();
  return bytes;
}
