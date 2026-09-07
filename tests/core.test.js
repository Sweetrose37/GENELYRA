import test from 'node:test';
import assert from 'node:assert/strict';
import { filterGenerators, generators } from '../src/data.js';
import { config, safeUrl } from '../src/config.js';
import { validateEmail, subscribe } from '../src/newsletter.js';

test('Only the confirmed product can be considered available',()=>{
 assert.deepEqual(generators.filter(x=>x.confirmed).map(x=>x.id),['fanwear-forge','boombox-kids']);
 assert.equal(safeUrl(config.storeUrl),'https://beacons.ai/crownandcraftstudio');
 assert.equal(safeUrl(config.checkoutUrls['fanwear-forge']),null);
 assert.equal(safeUrl('javascript:alert(1)'),null);
 assert.equal(safeUrl('https://stan.store/brand'),'https://stan.store/brand');
});
test('Filtering combines category and case-insensitive search, including empty states',()=>{
 assert.equal(filterGenerators('sports','fanwear').length,1);
 assert.equal(filterGenerators('kids','fanwear').length,0);
 assert.equal(filterGenerators('art','').length,0);
 assert.equal(filterGenerators('all','  BIZGEN ').length,1);
});
test('Newsletter validates and never contacts a service when unconfigured',async()=>{
 assert.equal(validateEmail('person@example.com'),true);
 for(const email of ['','person','person@','person@site','x y@site.com']) assert.equal(validateEmail(email),false);
 await assert.rejects(subscribe('person@example.com',()=>{throw new Error('Should not fetch');}),/coming soon/);
});
test('Newsletter requires explicit service confirmation, including failure and malformed responses',async()=>{
 config.newsletter.endpoint='https://example.com/subscribe';
 try {
  await assert.rejects(subscribe('bad'),/valid email/);
  await assert.rejects(subscribe('a@b.com',async()=>({ok:false})),/could not complete/);
  await assert.rejects(subscribe('a@b.com',async()=>({ok:true,json:async()=>({success:true})})),/not been confirmed/);
  await assert.rejects(subscribe('a@b.com',async()=>({ok:true,json:async()=>({subscribed:false})})),/not been confirmed/);
  assert.equal(await subscribe(' a@b.com ',async(url,options)=>{assert.deepEqual(JSON.parse(options.body),{email:'a@b.com'});return {ok:true,json:async()=>({subscribed:true})};}),true);
 } finally { config.newsletter.endpoint=''; }
});
