import { firestore } from './_firebase';

type Request = { method?: string; body?: unknown };
type Response = { status: (code: number) => Response; json: (body: unknown) => void };

type WebhookBody = {
  event?: string;
  data?: { reference?: string; status?: string; amount?: number };
  reference?: string;
};

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

  const paymentResponse = await fetch(`https://api.yebeck.com/api/v1/status/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  const paymentResult = await paymentResponse.json() as {
    success?: boolean;
    data?: { reference?: string; status?: string; amount?: number };
  };
  if (!paymentResponse.ok || !paymentResult.success || paymentResult.data?.status !== 'successful') {
    return res.status(202).json({ received: true });
  }

  const matchingOrders = await firestore.collection('orders')
    .where('yebeckReference', '==', reference)
    .limit(1)
    .get();
  if (matchingOrders.empty) return res.status(202).json({ received: true });

  const order = matchingOrders.docs[0];
  const orderData = order.data() as { total?: number; status?: string };
  if (orderData.status === 'confirmed') return res.status(200).json({ received: true });
  if (paymentResult.data.amount !== orderData.total) {
    console.error(`Payment amount mismatch for order ${order.id}.`);
    return res.status(400).json({ error: 'Payment amount mismatch.' });
  }

  await order.ref.update({ status: 'confirmed' });
  return res.status(200).json({ received: true });
}
