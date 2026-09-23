const ORDER_RECEIPT_STORAGE_KEY = 'hlime-order-receipt';

function safeReceipt(receipt) {
  if (!receipt || !['string', 'number'].includes(typeof receipt.order_id)) return null;
  if (typeof receipt.order_code !== 'string' || !/^HL\d{8,}$/.test(receipt.order_code)) return null;
  if (typeof receipt.order_status !== 'string') return null;
  if (!['BANK_TRANSFER', 'CASH'].includes(receipt.payment_method)) return null;
  if (!['UNPAID', 'PAID'].includes(receipt.payment_status)) return null;
  if (!Number.isFinite(Number(receipt.subtotal_amount))) return null;
  if (receipt.payment_method === 'BANK_TRANSFER' && [
    receipt.payment_bank_id,
    receipt.payment_bank_name,
    receipt.payment_account_no,
    receipt.payment_account_name,
  ].some((value) => typeof value !== 'string' || !value.trim())) return null;
  return {
    order_id: receipt.order_id,
    order_code: receipt.order_code,
    order_status: receipt.order_status,
    subtotal_amount: Number(receipt.subtotal_amount),
    payment_method: receipt.payment_method,
    payment_status: receipt.payment_status,
    paid_at: typeof receipt.paid_at === 'string' ? receipt.paid_at : null,
    payment_bank_id: receipt.payment_bank_id || null,
    payment_bank_name: receipt.payment_bank_name || null,
    payment_account_no: receipt.payment_account_no || null,
    payment_account_name: receipt.payment_account_name || null,
    payment_instruction_vi: receipt.payment_instruction_vi || null,
    payment_instruction_ko: receipt.payment_instruction_ko || null,
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
