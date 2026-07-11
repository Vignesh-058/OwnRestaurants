/**
 * Formats a number into a currency string (e.g., 1000 -> 1,000).
 */
export const formatCurrencyAmount = (amount: number): string => {
 return amount.toLocaleString('en-IN', {
 maximumFractionDigits: 2,
 });
};

/**
 * Formats an ISO date string into a readable format.
 * Example: 2024-01-01T12:00:00Z -> "01 Jan 2024, 12:00 PM"
 */
export const formatDate = (isoString: string): string => {
 const date = new Date(isoString);
 return date.toLocaleDateString('en-US', {
 day: '2-digit',
 month: 'short',
 year: 'numeric',
 hour: '2-digit',
 minute: '2-digit',
 });
};

/**
 * Formats an order ID to be clean and readable.
 * Example: "60d5ec9af682fbd39a1b8b9d" -> "ORD-8B9D"
 */
export const formatOrderId = (id: string): string => {
 if (!id) return '';
 return `ORD-${id.slice(-6).toUpperCase()}`;
};
