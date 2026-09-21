import { requireSupabase } from './supabase';

const ORDER_REQUEST_STORAGE_KEY = 'hlime-order-request';
let memoryRequest = null;

function readStoredRequest() {
  try {
    const value = window.sessionStorage.getItem(ORDER_REQUEST_STORAGE_KEY);
    return value ? JSON.parse(value) : memoryRequest;
  } catch {
    return memoryRequest;
  }
}

function writeStoredRequest(value) {
  memoryRequest = value;
  try {
    window.sessionStorage.setItem(ORDER_REQUEST_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // The in-memory copy still keeps retries idempotent for this page session.
  }
}

function getRequestId(order) {
  const fingerprint = JSON.stringify(order);
  const stored = readStoredRequest();
  if (stored?.fingerprint === fingerprint && stored?.requestId) return stored.requestId;

  const requestId = globalThis.crypto.randomUUID();
  writeStoredRequest({ fingerprint, requestId });
  return requestId;
}

export function clearOrderRequestId() {
  memoryRequest = null;
  try {
    window.sessionStorage.removeItem(ORDER_REQUEST_STORAGE_KEY);
  } catch {
    // Nothing else is required when sessionStorage is unavailable.
  }
}

export function buildOrderPayload({ locale, orderDraft, items }) {
  return {
    locale,
    customer_name: orderDraft.customer_name,
    customer_phone: orderDraft.customer_phone,
    customer_email: orderDraft.customer_email || null,
    fulfillment_type: orderDraft.fulfillment,
    delivery_address: orderDraft.fulfillment === 'delivery' ? orderDraft.delivery_address : null,
    delivery_note: orderDraft.fulfillment === 'delivery' ? orderDraft.delivery_note || null : null,
    requested_fulfillment_date: orderDraft.order_date,
    requested_fulfillment_time: orderDraft.order_time,
    order_note: orderDraft.order_note || null,
    items: items.map(({ item, product }) => ({
      product_slug: product.id,
      quantity: item.quantity,
      ...(product.category === 'celebration' ? {
        size_option_key: item.options?.size,
        flavor_option_key: item.options?.flavor,
        celebration_required_date: item.options?.date,
        celebration_note: item.options?.note || null,
      } : {}),
    })),
  };
}

export async function submitPublicOrder(order) {
  const requestId = getRequestId(order);
  const { data, error } = await requireSupabase().rpc('submit_order', {
    p_client_request_id: requestId,
    p_order: order,
  }).single();

  if (error) throw error;
  return data;
}
