export function normalizePhoneE164(raw: string): string {
  const s = raw.trim();
  if (!s.startsWith("+")) return s; // assume caller provides +country...
  return s;
}

export function waLink(phoneE164: string, message: string): string {
  const digits = phoneE164.replace(/[^\d+]/g, "");
  const text = encodeURIComponent(message);
  // WhatsApp click-to-chat supports wa.me with digits only (no +). We'll remove '+'.
  const waDigits = digits.startsWith("+") ? digits.slice(1) : digits;
  return `https://wa.me/${waDigits}?text=${text}`;
}

export function msgNewOrder(businessName: string, orderNo: number, total: number): string {
  return `السلام عليكم\nتم تسجيل طلب جديد رقم #${orderNo} لدى ${businessName}.\nالإجمالي: ${total.toFixed(2)}\nهل تؤكد الطلب؟`;
}

export function msgFollowUp(orderNo: number): string {
  return `تذكير لطيف بخصوص الطلب رقم #${orderNo}.\nهل يمكنني مساعدتك بأي شيء لإكمال الطلب؟`;
}

export function msgPaymentReminder(orderNo: number, total: number): string {
  return `تذكير بالدفع للطلب رقم #${orderNo}.\nالمبلغ المستحق: ${total.toFixed(2)}\nعند التحويل أرسل صورة الإيصال هنا لو سمحت.`;
}
