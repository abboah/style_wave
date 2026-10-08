# Firebase setup

The app uses Firebase Authentication and Cloud Firestore.

## Firebase console

1. Open the `style-wave` project in the Firebase console.
2. Enable **Authentication > Sign-in method > Email/Password**.
3. Create the creator account under **Authentication > Users**.
4. Create a Firestore database.
5. Publish the rules in [`firestore.rules`](../firestore.rules).

The Firebase web configuration is read from Vite variables. The current project values are supplied as safe client-side defaults in `src/lib/firebase.ts`; use environment variables for other deployments:

```text
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

The first successful creator sign-in migrates the bundled products, store configuration, and analytics defaults into Firestore when those collections are empty.

## Firestore collections

- `products/{productId}`: public catalog, creator-managed
- `orders/{orderId}`: checkout orders and creator status updates
- `store/config`: public store and Yebeck configuration
- `analytics/store`: creator analytics counters
