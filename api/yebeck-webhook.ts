/// <reference types="node" />
import { firestore } from './_firebase.js';

type Request = { method?: string; body?: unknown };
type Response = { status: (code: number) => Response; json: (body: unknown) => void };

type WebhookBody = {
  event?: string;
  data?: { reference?: string; status?: string; amount?: number | string };
  reference?: string;
};

type PaymentData = {
  reference?: string;
  status?: string;
  amount?: number | string;
  transaction?: {
    reference?: string;
    status?: string;
    amount?: number | string;
  };
};

async function getPaymentStatus(reference: string, apiKey: string) {
  for (const delay of [0, 500, 1500, 3000]) {
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    const response = await fetch(`https://api.yebeck.com/api/v1/status/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const result = await response.json() as {
      success?: boolean;
      data?: PaymentData;
    };
    const data = result.data?.transaction || result.data;
    if (response.ok && result.success && findPaymentField(data, 'status') === 'successful') {
      return { result, data };
    }
  }
  return null;
}

function findPaymentField(value: unknown, field: 'status' | 'amount' | 'reference'): string | number | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const directValue = record[field];
  if (typeof directValue === 'string' || typeof directValue === 'number') return directValue;

  for (const nestedValue of Object.values(record)) {
    const result = findPaymentField(nestedValue, field);
    if (result !== undefined) return result;
  }
  return undefined;
}

function findPaymentAmount(value: unknown): number {
  if (!value || typeof value !== 'object') return Number.NaN;
  const record = value as Record<string, unknown>;
  for (const key of ['amount', 'amount_ghs', 'transaction_amount']) {
    const candidate = record[key];
    if (typeof candidate === 'number') return candidate;
    if (typeof candidate === 'string') {
      const parsed = Number(candidate.replace(/[^0-9.-]/g, ''));
      if (Number.isFinite(parsed)) return parsed;
    }
    if (candidate && typeof candidate === 'object') {
      const nestedValue = (candidate as Record<string, unknown>).value;
      const parsed = Number(nestedValue);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  for (const nestedValue of Object.values(record)) {
    const result = findPaymentAmount(nestedValue);
    if (Number.isFinite(result)) return result;
  }
  return Number.NaN;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = (req.body || {}) as WebhookBody;
  const reference = body.data?.reference || body.reference;
  if (!reference) return res.status(400).json({ error: 'Missing payment reference.' });

  const apiKey = process.env.YEBECK_API_KEY;
  if (!apiKey) {
    console.error('YEBECK_API_KEY is not configured.');
    return res.status(500).json({ error: 'Webhook verification is unavailable.' });
  }

  const verifiedPayment = await getPaymentStatus(reference, apiKey);
  const paymentData = verifiedPayment?.data;
  const paymentState = findPaymentField(paymentData, 'status');
  const paymentReference = findPaymentField(paymentData, 'reference');
  const webhookAmount = Number(body.data?.amount);
  const webhookIndicatesSuccess = body.event === 'collection.successful'
    && body.data?.status === 'successful'
    && Number.isFinite(webhookAmount);

  const matchingOrders = await firestore.collection('orders')
    .where('yebeckReference', '==', reference)
    .limit(1)
    .get();
  if (matchingOrders.empty) return res.status(202).json({ received: true });

  const order = matchingOrders.docs[0];
  const orderData = order.data() as { total?: number; status?: string };
  if (orderData.status === 'confirmed') return res.status(200).json({ received: true });
  const paymentIsVerified = paymentState === 'successful'
    && paymentReference === reference;
  if (!paymentIsVerified && !webhookIndicatesSuccess) {
    return res.status(202).json({ received: true });
  }
  const paidAmount = webhookIndicatesSuccess ? webhookAmount : findPaymentAmount(paymentData);
  if (!Number.isFinite(paidAmount)
    || Math.abs(paidAmount - Number(orderData.total)) > 0.01) {
    console.error(`Payment amount mismatch for order ${order.id}.`);
    return res.status(400).json({ error: 'Payment amount mismatch.' });
  }

  await order.ref.update({ status: 'confirmed' });
  return res.status(200).json({ received: true });
}
