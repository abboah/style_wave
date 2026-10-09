import { auth } from './firebase';

async function request<T>(method: 'GET' | 'POST', body?: unknown): Promise<T> {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;
  const response = await fetch('/api/store', {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const result = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(result.error || 'Store request failed.');
  return result;
}

export const getStoreSnapshot = () => request<{
  products: import('../types').Product[];
  config: import('../types').MerchantConfig | null;
  analytics: import('../types').StoreAnalytics | null;
}>('GET');

export const storeAction = <T = { ok: true }>(action: string, payload?: unknown) =>
  request<T>('POST', { action, payload });
