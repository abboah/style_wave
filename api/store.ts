import { ensureNeonSchema, sql } from './_neon.js';

type VercelRequest = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

function json(value: unknown) {
  return JSON.stringify(value);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureNeonSchema();
    if (req.method === 'GET') {
      const products = await sql`SELECT data FROM products ORDER BY updated_at DESC`;
      const config = await sql`SELECT data FROM store_config WHERE id = 1`;
      const analytics = await sql`SELECT total_visits, unique_visitors, last_visit_date FROM store_analytics WHERE id = 1`;
      return res.status(200).json({
        products: products.map(row => row.data),
        config: config[0]?.data || null,
        analytics: analytics[0] || null
      });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
    const { action, payload } = req.body as { action?: string; payload?: Record<string, unknown> };

    if (action === 'record-visit') {
      const unique = payload?.isNewVisitor === true ? 1 : 0;
      await sql`
        INSERT INTO store_analytics (id, total_visits, unique_visitors, last_visit_date)
        VALUES (1, 1, ${unique}, ${new Date().toISOString()})
        ON CONFLICT (id) DO UPDATE SET
          total_visits = store_analytics.total_visits + 1,
          unique_visitors = store_analytics.unique_visitors + ${unique},
          last_visit_date = ${new Date().toISOString()}
      `;
      return res.status(200).json({ ok: true });
    }

    const authorization = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;
    const { requireCreator } = await import('./_auth.js');
    await requireCreator(authorization);

    if (action === 'bootstrap') {
      const products = Array.isArray(payload?.products) ? payload.products : [];
      for (const product of products) {
        const value = product as { id?: string };
        if (value.id) await sql`INSERT INTO products (id, data) VALUES (${value.id}, ${json(product)}::jsonb) ON CONFLICT (id) DO NOTHING`;
      }
      if (payload?.config) await sql`INSERT INTO store_config (id, data) VALUES (1, ${json(payload.config)}::jsonb) ON CONFLICT (id) DO NOTHING`;
      await sql`INSERT INTO store_analytics (id, total_visits, unique_visitors, last_visit_date) VALUES (1, 0, 0, '') ON CONFLICT (id) DO NOTHING`;
      return res.status(200).json({ ok: true });
    }
    if (action === 'upsert-product') {
      const product = payload?.product as { id?: string } | undefined;
      if (!product?.id) return res.status(400).json({ error: 'Product id is required.' });
      await sql`INSERT INTO products (id, data) VALUES (${product.id}, ${json(product)}::jsonb) ON CONFLICT (id) DO UPDATE SET data = ${json(product)}::jsonb, updated_at = NOW()`;
      return res.status(200).json({ ok: true });
    }
    if (action === 'delete-product') {
      await sql`DELETE FROM products WHERE id = ${String(payload?.id || '')}`;
      return res.status(200).json({ ok: true });
    }
    if (action === 'update-config') {
      await sql`INSERT INTO store_config (id, data) VALUES (1, ${json(payload?.config || {})}::jsonb) ON CONFLICT (id) DO UPDATE SET data = store_config.data || ${json(payload?.config || {})}::jsonb, updated_at = NOW()`;
      return res.status(200).json({ ok: true });
    }
    if (action === 'list-orders') {
      const orders = await sql`SELECT data FROM orders ORDER BY created_at DESC`;
      return res.status(200).json({ orders: orders.map(row => row.data) });
    }
    if (action === 'update-order') {
      await sql`UPDATE orders SET data = data || ${json(payload?.updates || {})}::jsonb, updated_at = NOW() WHERE order_id = ${String(payload?.orderId || '')}`;
      return res.status(200).json({ ok: true });
    }
    if (action === 'delete-order') {
      await sql`DELETE FROM orders WHERE order_id = ${String(payload?.orderId || '')}`;
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: 'Unknown store action.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Store operation failed.';
    console.error('Neon store operation failed:', message);
    return res.status(message.includes('Authentication') || message.includes('Creator') ? 401 : 500)
      .json({ error: 'Store operation failed.' });
  }
}
