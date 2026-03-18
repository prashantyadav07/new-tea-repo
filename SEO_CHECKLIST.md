# ALL-INDIA NATIONAL SEO CHECKLIST

## NATIONAL KEYWORD STRATEGY

**Primary English (10 keywords):**
- best chai india
- order tea online india
- buy organic tea online india
- masala chai delivery india
- premium chai india
- authentic indian chai
- best tea brand india
- chai order india
- organic masala chai india
- pan india tea delivery

**Long-tail English (10 keywords):**
- "best masala chai delivery india free shipping"
- "buy authentic loose leaf tea india"
- "organic green tea online india cheap"
- "chai gift hamper delivery india"
- "premium tea subscription box india"
- "buy herbal tea online india"
- "best tea for immunity india"
- "authentic chai brands online india"
- "order green tea online india"
- "best tea for weight loss india"

**Hindi Devanagari (10 keywords):**
- मुजफ्फरनगर चाय
- चाय ऑर्डर करें
- ऑर्गेनिक चाय
- चाय की दुकान
- बेस्ट चाय इंडिया
- मसाला चाय ऑनलाइन
- हर्बल चाय भारत
- हरी चाय ऑनलाइन
- प्रीमियम चाय
- भारत में चाय डिलीवरी

**City-intent (10 keywords):**
- "chai delivery delhi"
- "buy tea online mumbai"
- "organic chai bengaluru"
- "masala chai lucknow"
- "tea online kolkata"
- "chai jaipur delivery"
- "tea delivery noida"
- "premium tea chennai"
- "organic tea hyderabad"
- "chai order pune"

## COMPETITOR GAP ANALYSIS
For each competitor (Teabox, Vahdam, Chaayos, Chai Point, Tea Trunk, Wagh Bakri, Society Tea):
- **Top 3 keywords they rank for that Chai Adda should target** (e.g. "order chai online", "premium indian tea").
- **Content gaps to exploit**: Emphasize exact source origin tracking and "local feel with national reach" which global brands lack.
- **Backlink sources they use**: PR from startup magazines and local food reviewers.

## GOOGLE SEARCH CONSOLE STEPS
- [x] Domain verification
- [x] Submit `sitemap-index.xml`
- [x] Request indexing for all city pages (e.g., `/chai-delhi`, `/chai-mumbai`)
- [x] Monitor Coverage + Enhancements + Core Web Vitals on a weekly basis.

## Complete Technical Configuration (Phase 2)
### Sitemap Generation
- [x] Connected `generate-sitemap.js` to live Node.js API endpoint.
- [x] Built resilient retry-logic (3 attempts) to prevent build failures.
- [x] Integrated `sitemap-images.xml` explicitly mapping `image:loc`, `image:title`, and `image:caption`.
- [x] Fully automated sitemap generation into the `npm run build` command.

### Web Vitals / Performance Optimization
- [x] Split application chunks intentionally (React, Vendor, Router) via `vite.config.js`.
- [x] Migrated all `AppRoutes.jsx` imports to `React.lazy()` asynchronous deferred loading.
- [x] Deployed strict invisible `<div />` components as the Suspense Fallback to guarantee a 0.0 CLS score on route load.
- [x] Added `max-width: 100%; height: auto` globally to `<img>` via `index.css` to fix layout shift bugs universally.

### Schema JSON-LD Validation (Fully Mapped to Chai Adda context)
- [x] Organization + Store Schema established.
- [x] FAQPage Schema implemented for the homepage.
- [x] Product Schema mapped (including shipping configuration targeting IN).
- [x] BreadcrumbList generated.

### Content Engine Deployment
- [x] 10x 800+ Word English Blog Articles produced targeting nationwide organic queries.
- [x] 3x 600+ Word Hindi Blog Articles produced for tier 2/3 market penetration via Devanagari keyword indexing.
- [x] Dynamic `/blog/:slug` React route created to render static data via standard brand typography.

### Off-Page Strategy Framework 
- [x] `SEO_OFFPAGE_GUIDE.md` generated holding the Top 10 Indian Directory submission URLs, categories, and NAP formats.
- [x] `SEO_GBP_GUIDE.md` built for aggressive local-to-national Head Office trust mapping.
- [x] `SEO_GSC_GUIDE.md` designed for Analytics parsing.
- [x] `SEO_INSTAGRAM_STRATEGY.md` planned out to trigger Google video-carousel Rich Snippets via algorithm-optimized Reels.

## CORE WEB VITALS — INDIA 4G NETWORK FOCUS
- **LCP < 2.5s** on slow 4G (critical for tier-2 city users).
- **INP < 200ms** — React.lazy and deferred JS for smooth interacting.
- **CLS < 0.1** — Set explicit image width/height in CSS and HTML.
- **WebP/AVIF images** — Aim for 60% payload reduction over JPEG.
- **CDN via Edge** — Setup Cloudflare or Vercel Edge with PoPs in Mumbai or Chennai.

## GOOGLE BUSINESS PROFILE CHECKLIST
- [ ] Upload fresh team or facility photos on a weekly schedule.
- [ ] Respond to every review within 24 hours.
- [ ] Post at least 2 Google Posts per week highlighting new blends.

## BACKLINK STRATEGY — ALL-INDIA
- **National food directories**: JustDial, Sulekha, IndiaMART, TradeIndia.
- **Guest posts**: Indian food blogs, wellness sites, and lifestyle platforms (e.g., LBB, NDTV Food).
- **PR Pitching**: NDTV Food, Times Food, Hindustan Times Brunch, YourStory, Inc42 (emphasize the "startup" and "local to national" angle).
- **Instagram Reels national hashtags**: #bestchaiindia #chailovers #organictea #indianchai #chaitime #chaiofinstagram #teaindia #premiumtea
- **E-commerce**: Create and optimize an Amazon India and Flipkart seller page linking back to site.

## BLOG CONTENT CALENDAR — 10 ARTICLES, ALL-INDIA AUDIENCE
*Each generated with strong Title + 150-160 char unique meta description.*

1. **Best Chai Recipe India — Authentic Masala Chai at Home**
2. **Health Benefits of Masala Chai — Why 1.4 Billion Indians Love Tea**
3. **Organic Tea vs Regular Tea — What Every Indian Should Know**
4. **How to Make Perfect Chai at Home Like a Professional**
5. **Chai Culture Across India — North vs South vs East vs West**
6. **Green Tea vs Black Tea — Ultimate Guide for Indian Tea Buyers**
7. **Why Loose Leaf Tea is Better Than Tea Bags for Indians**
8. **Best Tea for Digestion — Herbal Chai Remedies Used Across India**
9. **How to Buy the Best Tea Online in India Without Getting Cheated**
10. **Story of Indian Chai — From Assam Tea Gardens to Your Cup**
