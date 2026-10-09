import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) throw new Error('Firebase Admin credentials are not configured.');

const app = getApps()[0] || initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
export const adminAuth = getAuth(app);

export async function requireCreator(authorization?: string) {
  if (!authorization?.startsWith('Bearer ')) throw new Error('Authentication required.');
  const token = await adminAuth.verifyIdToken(authorization.slice(7));
  if (token.firebase?.sign_in_provider !== 'password') throw new Error('Creator authentication required.');
  return token;
}
