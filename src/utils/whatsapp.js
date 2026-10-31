export const getWhatsAppUrl = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const internationalNumber = digits.startsWith("00")
    ? digits.slice(2)
    : digits.startsWith("0")
      ? `213${digits.slice(1)}`
      : digits;

  return `https://wa.me/${internationalNumber}`;
};
