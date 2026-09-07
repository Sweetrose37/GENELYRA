import '@fontsource-variable/dm-sans/wght.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';
import { Header, Hero, HowItWorks, Footer } from './components/layout.js';
import { Catalog, GeneratorCard, ComingSoonCard } from './components/catalog.js';
import { icon } from './components/icons.js';
import { generators, filterGenerators } from './data.js';
import { config, safeUrl } from './config.js';
import { initNewsletter } from './newsletter.js';

document.querySelector('#app').innerHTML = `${Header()}<main id="main">${Hero()}${Catalog()}${HowItWorks()}</main>${Footer()}<nav class="section-progress" aria-label="Page sections">${[['home','Home'],['generators','Generators'],['how-it-works','How it works'],['newsletter','Newsletter']].map(([id,label])=>`<a href="#${id}" aria-label="${label}"></a>`).join('')}</nav><dialog id="detail-dialog" aria-labelledby="dialog-title"><button class="dialog-close icon-button" aria-label="Close dialog">${icon('close')}</button><div class="dialog-content"></div></dialog>`;

const motion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const track = document.querySelector('#generator-track');
const search = document.querySelector('#search');
let category = 'all';
function renderCatalog() {
 const items = filterGenerators(category, search.value);
 track.innerHTML = items.length ? items.map(GeneratorCard).join('') + (category === 'all' && !search.value.trim() ? ComingSoonCard() : '') : `<div class="empty-state">${icon('spark')}<h3>Something new is on the horizon.</h3><p>No generators match this selection yet.</p><button class="button outline" data-reset>Explore all generators ${icon('arrow')}</button></div>`;
 track.scrollLeft = 0;
 document.querySelector('#results-status').textContent = `${items.length} ${items.length === 1 ? 'generator' : 'generators'}${category==='all'?'':' in this category'}`;
 requestAnimationFrame(updateArrows);
}
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
 category = button.dataset.category;
 document.querySelectorAll('[data-category]').forEach(b=>{ b.classList.toggle('selected', b===button); b.setAttribute('aria-pressed',String(b===button)); });
 renderCatalog();
}));
search.addEventListener('input',renderCatalog);
document.querySelector('.search').addEventListener('submit',e=>{ e.preventDefault(); document.querySelector('#generators').scrollIntoView({behavior:motion.matches?'instant':'smooth'}); track.focus({preventScroll:true}); });
document.addEventListener('click',e=>{if(e.target.closest('[data-reset]')){search.value='';document.querySelector('[data-category="all"]').click();}});
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
function updateArrows() { previous.disabled = track.scrollLeft < 4; next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
function moveCarousel(direction) { const card=track.querySelector('.generator-card'); track.scrollBy({left:direction*((card?.offsetWidth || 220)+12),behavior:motion.matches?'instant':'smooth'}); }
previous.addEventListener('click',()=>moveCarousel(-1)); next.addEventListener('click',()=>moveCarousel(1));
track.addEventListener('scroll',updateArrows,{passive:true}); window.addEventListener('resize',updateArrows);
track.addEventListener('keydown',e=>{ if(e.target!==track)return; if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault(); if(e.key==='Home'||e.key==='End')track.scrollTo({left:e.key==='Home'?0:track.scrollWidth,behavior:motion.matches?'instant':'smooth'});else moveCarousel(e.key==='ArrowLeft'?-1:1);} });
let drag = null, suppressClick = false;
track.addEventListener('pointerdown',e=>{ if(e.pointerType!=='mouse'||e.button!==0)return; drag={x:e.clientX,scroll:track.scrollLeft,id:e.pointerId,moved:false}; });
track.addEventListener('pointermove',e=>{if(!drag)return;const delta=e.clientX-drag.x;if(Math.abs(delta)>6&&!drag.moved){drag.moved=true;track.setPointerCapture(e.pointerId);track.classList.add('dragging');}if(drag.moved){track.scrollLeft=drag.scroll-delta;}});
function endDrag(){if(!drag)return;suppressClick=drag.moved;drag=null;track.classList.remove('dragging');setTimeout(()=>suppressClick=false,0);}
track.addEventListener('pointerup',endDrag);track.addEventListener('pointercancel',endDrag);track.addEventListener('lostpointercapture',endDrag);
track.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();}},true);

const dialog = document.querySelector('#detail-dialog');
let opener;
const notices = {
 store: ['The next chapter is coming.', '<p>The GENELYRA store is not available from this site yet. Checkout will appear here when the store is ready.</p><a class="button gold" href="#newsletter" data-close>Follow what’s next →</a>'],
 bundles: ['Good things, together.', '<p>Bundles are coming soon. No bundle offerings or prices have been confirmed yet.</p><a class="button gold" href="#generators" data-close>Explore the collection →</a>'],
 experience: ['Enter the GENELYRA universe.', '<p>A cinematic home for creators, dreamers, and your next big idea.</p><p class="muted">The experience film is coming soon.</p><a class="button gold" href="#generators" data-close>Explore Generators →</a>'],
 story: ['Creators change everything.', '<p>GENELYRA is a creative universe for people who see possibility everywhere — in an idea, a design, a business, a new beginning.</p><p>We believe in bigger ideas and brighter tomorrows. FANWEAR FORGE™ and BOOMBOX KIDS™ are confirmed names in our collection. The rest of the story is still taking shape.</p><p class="dialog-tagline">Where Ideas Become Engines.</p>'],
 faq: ['A little clarity. More possibility.', '<details open><summary>Which generators are confirmed?</summary><p>FANWEAR FORGE™ and BOOMBOX KIDS™ are confirmed. All other names shown are placeholder concepts from our visual preview.</p></details><details><summary>Can I purchase a generator now?</summary><p>Purchasing is available only when a real checkout link is provided. Otherwise, the generator is clearly marked unavailable.</p></details><details><summary>How will I access my purchase?</summary><p>When purchasing becomes available, follow the access instructions supplied with your order. Individual product details are still to be confirmed.</p></details><details><summary>Can I join the newsletter?</summary><p>Newsletter sign-up becomes available when our subscription service is connected. The form only confirms success after that service confirms your subscription.</p></details>'],
 contact: ['Let’s stay connected.', config.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail) ? `<p>Email us at <a href="mailto:${encodeURIComponent(config.contactEmail)}">${config.contactEmail.replace(/[<>&"]/g,'')}</a>.</p>` : '<p>Our contact channel is coming soon. Check back here for updates from GENELYRA.</p>'],
};
function openDialog(title,content){opener=document.activeElement;document.querySelector('.dialog-content').innerHTML=`<p class="eyebrow pink">The GENELYRA Universe</p><h2 id="dialog-title">${title}</h2>${content}`;dialog.showModal();document.body.classList.add('modal-open');}
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}if(e.target.closest('[data-close]'))dialog.close();});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus({preventScroll:true});});
document.addEventListener('click',e=>{
 const notice=e.target.closest('[data-dialog]');if(notice){const [title,content]=notices[notice.dataset.dialog];openDialog(title,content);}
 const product=e.target.closest('[data-product]');if(product){const item=generators.find(p=>p.id===product.dataset.product);const url=item.confirmed&&safeUrl(config.checkoutUrls[item.id]);openDialog(item.name,`<p class="product-status">${item.confirmed?'Confirmed generator':'Placeholder concept · Not confirmed'}</p><p>${item.confirmed?'This generator is part of the GENELYRA collection. Purchase through its Beacons checkout when available.':'This name is a preview concept from the GENELYRA blueprint. It is not a confirmed product and is not available to purchase.'}</p>${url?`<a class="button gold" href="${url}" target="_blank" rel="noopener noreferrer">Continue to checkout ${icon('arrow')}</a>`:'<button class="button unavailable" disabled>Checkout unavailable · Coming soon</button>'}`);}
});
const menu=document.querySelector('.menu-toggle'),mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');mobileNav.hidden=true;menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-label',open?'Open navigation':'Close navigation');mobileNav.hidden=open;});
mobileNav.addEventListener('click',e=>{if(e.target.closest('a,button'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});

const revealObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
let frame=0;
function updateScroll(){frame=0;const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${max>0?scrollY/max:1})`;const sections=[...document.querySelectorAll('#home,#generators,#how-it-works,#newsletter')];const active=sections.filter(s=>s.getBoundingClientRect().top<160).at(-1)||sections[0];document.querySelectorAll('.section-progress a,.desktop-nav a').forEach(a=>{const current=a.hash===`#${active.id}`;a.classList.toggle('active',current);if(current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});if(!motion.matches)document.querySelector('.hero-art').style.setProperty('--scroll',`${Math.min(scrollY*.12,55)}px`);}
window.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(updateScroll);},{passive:true});
const hero=document.querySelector('.hero');
hero.addEventListener('pointermove',e=>{if(motion.matches||!finePointer.matches)return;const r=hero.getBoundingClientRect();hero.style.setProperty('--px',`${(e.clientX/r.width-.5)*8}px`);hero.style.setProperty('--py',`${((e.clientY-r.top)/r.height-.5)*5}px`);});
hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--px','0px');hero.style.setProperty('--py','0px');});
track.addEventListener('pointermove',e=>{if(motion.matches||!finePointer.matches||drag?.moved)return;const card=e.target.closest('.generator-card');if(!card)return;const r=card.getBoundingClientRect();card.style.setProperty('--rx',`${-((e.clientY-r.top)/r.height-.5)*5}deg`);card.style.setProperty('--ry',`${((e.clientX-r.left)/r.width-.5)*5}deg`);});
track.addEventListener('pointerout',e=>{const card=e.target.closest('.generator-card');if(card&&!card.contains(e.relatedTarget)){card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');}});
renderCatalog();initNewsletter();updateScroll();
