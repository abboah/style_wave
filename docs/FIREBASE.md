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

## Vercel payment API

Checkout requests are sent to the Vercel functions in [`api/`](../api/). The browser sends product IDs, quantities, delivery details, and the mobile-money network; the server reads current product prices from Firestore and creates the order. The server then starts a Yebeck collection with the secret API key.

Configure these variables in Vercel Project Settings → Environment Variables:

```text
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
YEBECK_API_KEY=ybk_test_... # use ybk_live_... only for production
```

Never expose `YEBECK_API_KEY` through a `VITE_` variable, the browser bundle, Firestore, local storage, or a URL. Configure the Yebeck webhook endpoint as:

```text
https://your-vercel-domain.vercel.app/api/yebeck-webhook
```

The webhook handler verifies the transaction with Yebeck's status API, matches the payment reference and amount to the order, and only then changes the order status to `confirmed`. Test keys resolve immediately; live keys may remain pending until the mobile-money provider confirms them.

## Neon storage

The application data layer uses Neon for products, store configuration, analytics, and orders. Firebase remains responsible only for creator authentication. Create a Neon database through the Vercel Neon integration, ensure `DATABASE_URL` is available to Production and Preview, and run the one-time migration from a trusted machine:

```text
node scripts/migrate-firestore-to-neon.mjs
```

The migration reads the existing Firestore collections and upserts them into Neon. Do not commit a service-account JSON file or place `DATABASE_URL` in frontend variables. After migration, publish the updated application and keep Firestore read-only until the Neon data is verified.

## Firestore collections

- `products/{productId}`: public catalog, creator-managed
- `orders/{orderId}`: checkout orders created by the trusted Vercel API and creator status updates
- `store/config`: public store and Yebeck configuration
- `analytics/store`: creator analytics counters
