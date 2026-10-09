import { randomUUID } from 'node:crypto';
import type { Product, PlacedOrder, OrderCustomerInfo } from '../src/types';
import { firestore } from './_firebase';

type Request = {
  method?: string;
  body?: unknown;
};

type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => void;
};

type PaymentRequest = {
  items: Array<{ productId: string; selectedSize: string; quantity: number }>;
  customer: OrderCustomerInfo;
  deliveryMethod: 'standard' | 'express';
  network: 'mtn' | 'telecel' | 'at';
};

const YEBECK_API_URL = 'https://api.yebeck.com/api/v1';

function isPaymentRequest(value: unknown): value is PaymentRequest {
  if (!value || typeof value !== 'object') return false;
  const request = value as Partial<PaymentRequest>;
  return Array.isArray(request.items)
    && request.items.length > 0
    && (request.deliveryMethod === 'standard' || request.deliveryMethod === 'express')
    && (request.network === 'mtn' || request.network === 'telecel' || request.network === 'at')
    && Boolean(request.customer && typeof request.customer === 'object');
}

function isValidCustomer(customer: OrderCustomerInfo) {
  return Boolean(
    typeof customer.fullName === 'string' && customer.fullName.trim()
    && typeof customer.phone === 'string' && customer.phone.trim()
    && typeof customer.email === 'string'
    && typeof customer.address === 'string' && customer.address.trim()
    && typeof customer.city === 'string' && customer.city.trim()
    && typeof customer.region === 'string'
    && typeof customer.notes === 'string'
    && (!customer.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
  );
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!isPaymentRequest(req.body) || !isValidCustomer(req.body.customer)) {
    return res.status(400).json({ error: 'Invalid checkout details.' });
  }

  const apiKey = process.env.YEBECK_API_KEY;
  if (!apiKey) {
    console.error('YEBECK_API_KEY is not configured.');
    return res.status(500).json({ error: 'Payments are temporarily unavailable.' });
  }

  const orderId = `SW-GH-${randomUUID().slice(0, 8).toUpperCase()}`;
  if (req.body.items.some(item => (
    typeof item.productId !== 'string'
    || !item.productId
    || typeof item.selectedSize !== 'string'
    || !item.selectedSize
  ))) {
    return res.status(400).json({ error: 'Invalid product selection.' });
  }
  const productRefs = req.body.items.map(item => firestore.collection('products').doc(item.productId));
  const productSnapshots = await firestore.getAll(...productRefs);
  const products = new Map(productSnapshots.map(snapshot => [snapshot.id, snapshot.data() as Product | undefined]));

  const items = [];
  let subtotal = 0;
  for (const requestedItem of req.body.items) {
    if (!Number.isInteger(requestedItem.quantity) || requestedItem.quantity < 1 || requestedItem.quantity > 20) {
      return res.status(400).json({ error: 'Invalid item quantity.' });
    }
    const product = products.get(requestedItem.productId);
    if (!product || !Number.isFinite(product.price) || product.price < 0
      || !Array.isArray(product.sizes)
      || product.isSoldOut
      || !product.sizes.includes(requestedItem.selectedSize)) {
      return res.status(400).json({ error: 'One or more selected products are unavailable.' });
    }
    const item = {
      product,
      selectedSize: requestedItem.selectedSize,
      quantity: requestedItem.quantity
    };
    items.push(item);
    subtotal += product.price * requestedItem.quantity;
  }

  const deliveryFee = req.body.deliveryMethod === 'standard' ? 35 : 60;
  const total = Number((subtotal + deliveryFee).toFixed(2));
  const order: PlacedOrder = {
    orderId,
    items,
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee,
    total,
    customer: {
      ...req.body.customer,
      fullName: req.body.customer.fullName.trim(),
      phone: req.body.customer.phone.trim(),
      email: req.body.customer.email.trim(),
      address: req.body.customer.address.trim(),
      city: req.body.customer.city.trim(),
      region: 'Ghana',
      notes: req.body.customer.notes.trim()
    },
    paymentMethod: 'yebeck',
    paymentNetwork: req.body.network,
    status: 'pending_payment',
    createdAt: new Date().toISOString()
  };

  const orderRef = firestore.collection('orders').doc(orderId);
  await orderRef.set(order);

  try {
    const paymentResponse = await fetch(`${YEBECK_API_URL}/collections`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: total,
        network: req.body.network,
        customer_msisdn: order.customer.phone,
        customer_name: order.customer.fullName,
        narration: `Order ${orderId}`
      })
    });
    const paymentResult = await paymentResponse.json() as {
      success?: boolean;
      message?: string;
      data?: { reference?: string; status?: string };
    };

    if (!paymentResponse.ok || !paymentResult.success || !paymentResult.data?.reference) {
      await orderRef.delete();
      return res.status(502).json({ error: paymentResult.message || 'Yebeck payment could not be started.' });
    }

    const updatedOrder = {
      ...order,
      yebeckReference: paymentResult.data.reference
    };
    await orderRef.set(updatedOrder);
    return res.status(201).json({ order: updatedOrder });
  } catch (error) {
    await orderRef.delete();
    console.error('Yebeck payment initiation failed', error);
    return res.status(502).json({ error: 'Yebeck payment could not be started.' });
  }
}
