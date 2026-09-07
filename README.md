# GENELYRA™

A local, responsive implementation of the approved GENELYRA visual blueprint. Built with semantic HTML, reusable JavaScript components, CSS, and Vite. No runtime framework or animation dependencies.

## Local development

```sh
npm install
npm run dev
```

## Production verification

```sh
npm test
npm run build
npm run preview
```

The preview server binds to `127.0.0.1`. Nothing is published by these commands.

## Editing

- `src/data.js`: generator records and browsing categories. Only FANWEAR FORGE™ and BOOMBOX KIDS™ are confirmed. All other names remain explicitly labeled placeholder concepts. Add a record and an image pair to extend the carousel without changing its components.
- `src/config.js`: Store URL (currently Beacons), individual checkout URLs, newsletter endpoint and optional contact email. Empty or non-HTTPS checkout URLs produce honest unavailable states. No secrets belong in this public configuration.
- `src/components/`: shared wordmark, icons, navigation, hero, catalog, flow, and footer.
- `src/style.css`: visual identity, responsive layouts, motion, and focus styling.
- `public/assets/`: optimized responsive WebP artwork. Archival generated sources are in `artwork-source/`, excluded from the built site. Generation prompts are in `artwork-source/PROMPTS.md`.

## Newsletter integration

Set `config.newsletter.endpoint` to an HTTPS backend that accepts `POST` JSON `{ "email": "person@example.com" }`. It must allow the site's origin through CORS and return HTTP 2xx with JSON `{ "subscribed": true }` **only after the real service confirms the subscription**. Other responses show an error. Adapt `src/newsletter.js` to your provider's documented confirmation semantics if they differ; pending double-opt-in must not be represented as subscribed. Keep provider credentials on the backend. Requests time out after 12 seconds.

Without configuration, the form validates email, explains that sign-up is coming soon, and sends nothing. UI and unit tests use synthetic confirmations only; no real subscriptions are created during testing.

## Interaction and accessibility

Native touch swipe, mouse drag, arrows, and keyboard Left/Right/Home/End on the focused carousel; live search and category filters; focus-managed native dialogs; sticky navigation with a mobile menu; section progress; pointer tilt and parallax; intersection-based reveals; and `prefers-reduced-motion` support.

BOOMBOX KIDS™ links to its $25 one-time-purchase Beacons product page. The paid GPT access URL is delivered by Beacons after purchase and is not included in this repository. FANWEAR FORGE™ checkout remains unavailable until configured.

The experience video, bundle offerings, newsletter service, and contact channel remain coming soon. Concept artwork is illustrative and does not promise product capabilities. The exact tagline is preserved in editable text.

## Repository

This repository contains the landing page source, optimized assets, original artwork, and product-copy drafts. It does not deploy the website automatically. Local build outputs, dependencies, environment files, and verification screenshots are ignored.

To run the optional browser checks, start the preview at port 4173 and run `node scripts/verify-ui.mjs` with Microsoft Edge installed.
