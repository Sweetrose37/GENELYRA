// Public configuration only. Never place secret API keys in browser code.
export const config = {
  storeUrl: 'https://beacons.ai/crownandcraftstudio',
  checkoutUrls: { 'fanwear-forge': '', 'boombox-kids': 'https://shop.beacons.ai/crownandcraftstudio/ef658f0f-c2b9-4796-82bb-a9bc7b9bdf33' },
  // Direct generator access links are separate from paid checkout URLs.
  generatorUrls: {},
  newsletter: {
    // A CORS-enabled endpoint accepting POST { email } and returning
    // HTTP 2xx + JSON { subscribed: true } only after confirmed subscription.
    endpoint: '',
    timeoutMs: 12000,
  },
  contactEmail: '',
};

export function safeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch { return null; }
}
