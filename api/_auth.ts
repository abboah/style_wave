const firebaseWebApiKey = process.env.FIREBASE_WEB_API_KEY || 'AIzaSyB5sr0iHXn3n0uCiZz52BO9HYlnHrboB8g';

export async function requireCreator(authorization?: string) {
  if (!authorization?.startsWith('Bearer ')) throw new Error('Authentication required.');
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseWebApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: authorization.slice(7) })
  });
  if (!response.ok) throw new Error('Creator authentication required.');

  const data = await response.json() as {
    users?: Array<{ providerUserInfo?: Array<{ providerId?: string }> }>;
  };
  const providers = data.users?.[0]?.providerUserInfo || [];
  if (!providers.some(provider => provider.providerId === 'password')) {
    throw new Error('Creator authentication required.');
  }
  return data.users?.[0];
}
