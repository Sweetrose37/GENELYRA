import { config, safeUrl } from './config.js';
export function validateEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); }
export async function subscribe(email, fetcher = fetch) {
  if (!validateEmail(email)) throw new Error('Please enter a valid email address.');
  const endpoint = safeUrl(config.newsletter.endpoint);
  if (!endpoint) throw new Error('Sign-up is coming soon. Your email has not been submitted.');
  const response = await fetcher(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim() }), signal: AbortSignal.timeout(config.newsletter.timeoutMs) });
  if (!response.ok) throw new Error('The subscription service could not complete your request. Please try again later.');
  const result = await response.json();
  if (result.subscribed !== true) throw new Error('Your subscription has not been confirmed. Please try again later.');
  return true;
}
export function initNewsletter() {
 const form = document.querySelector('#newsletter-form');
 const input = form.querySelector('input');
 const status = form.querySelector('.form-status');
 const button = form.querySelector('button');
 form.addEventListener('submit', async event => {
  event.preventDefault();
  if (button.disabled) return;
  const valid = validateEmail(input.value);
  input.setAttribute('aria-invalid', String(!valid));
  if (!valid) { status.textContent = 'Please enter a valid email address.'; status.dataset.state = 'error'; input.focus(); return; }
  button.disabled = true; button.textContent = 'Submitting…'; form.setAttribute('aria-busy','true'); status.textContent = 'Connecting to the subscription service…'; status.dataset.state = 'submitting';
  try { await subscribe(input.value); status.textContent = 'You’re subscribed. Welcome to the GENELYRA movement.'; status.dataset.state = 'success'; form.reset(); }
  catch(error) { status.textContent = error.name === 'TimeoutError' ? 'The service took too long to respond. Please try again later.' : error instanceof TypeError ? 'Could not reach the subscription service. Please try again later.' : error.message; status.dataset.state = 'error'; }
  finally { button.disabled = false; button.innerHTML = 'Subscribe <span aria-hidden="true">→</span>'; form.removeAttribute('aria-busy'); }
 });
 input.addEventListener('input',()=>input.removeAttribute('aria-invalid'));
}
