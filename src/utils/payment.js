const VIETQR_IMAGE_BASE = 'https://img.vietqr.io/image';

export const PAYMENT_METHODS = Object.freeze({
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH',
});

export const PAYMENT_STATUSES = Object.freeze({
  UNPAID: 'UNPAID',
  PAID: 'PAID',
});

export function buildVietQrUrl({ bankId, accountNo, amount, orderCode, accountName }) {
  if (!bankId || !accountNo || !orderCode || !accountName || !Number.isFinite(Number(amount))) return '';

  const imageName = `${encodeURIComponent(bankId)}-${encodeURIComponent(accountNo)}-compact2.png`;
  const url = new URL(`${VIETQR_IMAGE_BASE}/${imageName}`);
  url.searchParams.set('amount', String(Math.round(Number(amount))));
  url.searchParams.set('addInfo', orderCode);
  url.searchParams.set('accountName', accountName);
  return url.toString();
}
