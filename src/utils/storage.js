const memoryStorage = new Map();
export const CART_KEY = 'hlime-prototype-cart';

export function storageGet(key) {
  try {
    return window.localStorage.getItem(key) ?? memoryStorage.get(key) ?? null;
  } catch {
    return memoryStorage.get(key) ?? null;
  }
}

export function storageSet(key, value) {
  memoryStorage.set(key, value);
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readCart() {
  try {
    const value = JSON.parse(storageGet(CART_KEY));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function writeCart(cart) {
  storageSet(CART_KEY, JSON.stringify(cart));
}

