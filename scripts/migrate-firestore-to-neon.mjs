import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { neon } from '@neondatabase/serverless';

const required = ['DATABASE_URL', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is required.`);
}

const firebaseApp = getApps()[0] || initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});
const firestore = getFirestore(firebaseApp);
const sql = neon(process.env.DATABASE_URL);

const schema = await (await import('node:fs/promises')).readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
for (const statement of schema.split(';').map(value => value.trim()).filter(Boolean)) await sql.query(statement);

const products = await firestore.collection('products').get();
for (const product of products.docs) {
  await sql`INSERT INTO products (id, data) VALUES (${product.id}, ${JSON.stringify(product.data())}::jsonb) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`;
}

const config = await firestore.doc('store/config').get();
if (config.exists) await sql`INSERT INTO store_config (id, data) VALUES (1, ${JSON.stringify(config.data())}::jsonb) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`;

const analytics = await firestore.doc('analytics/store').get();
if (analytics.exists) {
  const data = analytics.data();
  await sql`INSERT INTO store_analytics (id, total_visits, unique_visitors, last_visit_date) VALUES (1, ${Number(data.totalVisits || 0)}, ${Number(data.uniqueVisitors || 0)}, ${String(data.lastVisitDate || '')}) ON CONFLICT (id) DO UPDATE SET total_visits = EXCLUDED.total_visits, unique_visitors = EXCLUDED.unique_visitors, last_visit_date = EXCLUDED.last_visit_date`;
}

const orders = await firestore.collection('orders').get();
for (const order of orders.docs) {
  const data = order.data();
  await sql`INSERT INTO orders (order_id, data, created_at) VALUES (${order.id}, ${JSON.stringify(data)}::jsonb, ${new Date(data.createdAt || Date.now())}) ON CONFLICT (order_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`;
}

console.log(`Migrated ${products.size} products, ${orders.size} orders, and shared store data to Neon.`);
