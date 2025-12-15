// Format a number as INR currency (₹1,23,456.00)
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}

// Format a date string as DD MMM YYYY (e.g., 28 Jun 2025)
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Convert LOAN_TYPE or similar enums to readable label (e.g., HOME_LOAN -> Home Loan)
export function getLoanTypeLabel(type) {
  if (!type) return "N/A";
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}