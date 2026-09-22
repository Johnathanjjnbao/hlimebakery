const ORDER_RECEIPT_STORAGE_KEY = 'hlime-order-receipt';

function safeReceipt(receipt) {
  if (!receipt || !['string', 'number'].includes(typeof receipt.order_id)) return null;
  if (typeof receipt.order_status !== 'string') return null;
  return {
    order_id: receipt.order_id,
    order_status: receipt.order_status,
  };
}

export function readOrderReceipt() {
  try {
    return safeReceipt(JSON.parse(window.sessionStorage.getItem(ORDER_RECEIPT_STORAGE_KEY)));
  } catch {
    return null;
  }
}

export function storeOrderReceipt(receipt) {
  const value = safeReceipt(receipt);
  if (!value) return;
  try {
    window.sessionStorage.setItem(ORDER_RECEIPT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // The current page can still show the receipt when sessionStorage is unavailable.
  }
}

export function clearOrderReceipt() {
  try {
    window.sessionStorage.removeItem(ORDER_RECEIPT_STORAGE_KEY);
  } catch {
    // Nothing else is required when sessionStorage is unavailable.
  }
}
