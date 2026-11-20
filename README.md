# Measurement Reliability Lab

Milestone 1 uses the Paradise Nursery React shopping cart to test analytics consent and event collection. Browse the demo catalog, adjust the cart and try a simulated checkout.

## Demo analytics

Tracking starts off on every page load. Use **Allow tracking** to enable it for the current page. With consent, **Track product view**, **Add to cart** and **Demo checkout** queue `view_item`, `add_to_cart` and `begin_checkout` in `window.dataLayer`. Use **Turn off tracking** to stop new events. Events already queued remain until the page reloads.

Events carry a unique event ID, an item ID and a value in EUR. Checkout uses the ID `demo_cart` and the cart total. The tracker validates the payload and discards repeated event IDs. The queue lives in browser memory. This milestone has no external analytics tags, API calls or real payments.

## Run locally

Use Node.js 22, the version used in CI.

```bash
npm ci
npm run dev
```

```bash
npm run lint
npm test
npm run build
npm run preview
```

The app builds on the Paradise Nursery shopping-cart exercise. See the [roadmap](docs/roadmap.md) for later milestones.
