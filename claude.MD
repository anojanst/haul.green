Build a Next.js website for a NZ whiteware disposal business called GreenHaul (domain: greenhaul.kiwi).

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Resend (for emails)
- shadcn/ui components

## Brand
- Name: GreenHaul
- Tagline: "Whiteware gone, the green way."
- Colors: Forest green (#166534) as primary, white as secondary
- Tone: Friendly, local NZ, trustworthy

---

## SEO
Add full SEO metadata in app/layout.tsx:
- Title: "GreenHaul | Whiteware Removal & Disposal NZ"
- Description: "Book doorstep whiteware collection across NZ. Get instant pricing for fridge, washing machine, dryer and appliance removal. Fast, affordable, eco-friendly."
- Open Graph tags (title, description, image, url: greenhaul.kiwi)
- Twitter card tags
- Canonical URL
- robots meta tag
- keywords meta tag (whiteware removal NZ, appliance disposal, fridge removal, washing machine removal)
- JSON-LD structured data for LocalBusiness schema (name: GreenHaul, NZ, service: whiteware removal)

---

## Pages & Layout

### Global Layout (app/layout.tsx)
- Sticky header with GreenHaul logo (text-based, green) and a CTA button "Get Instant Price" that scrolls to the form
- Footer with: tagline "Whiteware gone, the green way.", links (Home, FAQ, Contact), email: hello@greenhaul.kiwi, copyright
- Clean sans-serif font (Inter)

### Home Page (app/page.tsx)
Sections in order:
1. **Hero** — Bold headline: "Whiteware gone, the green way." Subheading: "Instant pricing. Doorstep pickup. No hassle." CTA button: "Get My Instant Price" scrolls to the form
2. **How It Works** — 3 icon steps: "1. Select Items → 2. Choose Pickup → 3. Get Instant Price"
3. **Instant Price Form** (see form spec below)
4. **FAQ Section** (see FAQ spec below)

---

## Instant Price Form

Build as a single-page multi-step form component at components/PriceForm.tsx

### Pricing Constants (lib/pricing.ts)
```ts
export const ITEM_PRICES: Record<string, { name: string; price: number }> = {
  fridge:           { name: 'Fridge',            price: 65 },
  washing_machine:  { name: 'Washing Machine',   price: 60 },
  dryer:            { name: 'Dryer',             price: 55 },
  dishwasher:       { name: 'Dishwasher',        price: 55 },
  oven:             { name: 'Oven / Stove',      price: 60 },
  freezer:          { name: 'Freezer',           price: 60 },
  tv:               { name: 'TV',                price: 45 },
  microwave:        { name: 'Microwave',         price: 35 },
  other:            { name: 'Other Appliance',   price: 40 },
}

export const ADDITIONAL_ITEM_RATE = 15 // flat rate per item after the base item

export const PICKUP_SURCHARGES: Record<string, { label: string; surcharge: number }> = {
  driveway:          { label: 'Driveway / Ground Floor',          surcharge: 0  },
  first_floor:       { label: 'First Floor',                      surcharge: 20 },
  second_no_lift:    { label: '2nd Floor or Above — No Lift',     surcharge: 50 },
  second_with_lift:  { label: '2nd Floor or Above — With Lift',   surcharge: 30 },
}

// Distance tiers in km (driving distance from Onehunga, Auckland)
// Calculated via Google Maps Distance Matrix API at quote time
export const DISTANCE_TIERS = [
  { maxKm: 20,  levy: 0  },
  { maxKm: 40,  levy: 10 },
  { maxKm: 70,  levy: 20 },
  { maxKm: 100, levy: 30 },
  // beyond 100km: reject booking
]

export const BASE_LOCATION = {
  address: 'Onehunga, Auckland, New Zealand',
  lat: -36.9209,
  lng: 174.7868,
}

export const SERVICE_RADIUS_KM = 100
```

### Pricing Logic
- The customer builds a **bin** — a basket of items with individual quantities
- The **base item** is the single item with the highest unit price in the bin
- Total = base item price + (all other items × ADDITIONAL_ITEM_RATE) + pickup surcharge + distance levy
- Example: Fridge ($65) + Oven ($60) + Microwave ($35) → base = Fridge $65, additional = 2 items × $15 = $30, total items = $95 before surcharges
- If multiple of the same item, only one unit counts as base; all remaining units are additional rate

### Distance Calculation (lib/distance.ts)
Create a server-side utility that calls the Google Maps Distance Matrix API:
```ts
// POST /api/calculate-distance
// Body: { destination: string } (the customer's address string from autocomplete)
// Returns: { distanceKm: number; withinServiceArea: boolean; levy: number } or { error: string }
```

- Origin: always BASE_LOCATION (Onehunga, Auckland)
- Use driving mode
- Return distance in km (rounded up)
- Calculate levy from DISTANCE_TIERS
- If distance > SERVICE_RADIUS_KM return { withinServiceArea: false }
- Call this API route from the frontend when the customer selects their address in Step 2
- Show a loading spinner on the price display while distance is being calculated
- If the address is outside service area, show a friendly message: "Sorry, we don't currently service this area. We're expanding soon — enter your email to be notified." with an email input

### Step 1 — Build Your Bin
- Grid of appliance cards, each with: item name, icon (use lucide-react or emoji), quantity stepper (minus / count / plus)
- Items: Fridge, Washing Machine, Dryer, Dishwasher, Oven/Stove, Freezer, TV, Microwave, Other Appliance
- As items are added, show a running **Bin Summary** panel below the grid:
  - List each item with qty
  - Highlight the base item (highest price) with a green border/badge labelled "base"
  - Show subtotal (items only, before surcharges)
- Must have at least 1 item to proceed
- "Next" button proceeds to Step 2

### Step 2 — Pickup Details
- Address field using Google Places Autocomplete (@react-google-maps/api)
  - Restrict to New Zealand
  - On address selection, immediately call POST /api/calculate-distance
  - Show a subtle loading state ("Calculating distance…") while API call is in progress
  - If outside service area, show the friendly out-of-area message with email capture
  - If within service area, show the distance and applicable levy
- Pickup Type dropdown using PICKUP_SURCHARGES values
- Show a **live price summary** that updates as address and pickup type are selected:
  - Items subtotal
  - Floor surcharge (if any)
  - Distance levy (if any)
  - **Total in large green text**
- "Back" and "Next" buttons

### Step 3 — Your Details
- Fields: Full Name, Phone (NZ format hint: 021 XXX XXXX), Email address
- Show complete price breakdown:
  - Each item with qty (base item flagged)
  - Floor surcharge
  - Distance levy
  - **Total NZD**
- Two action buttons:
  - "Book Now" (primary green button)
  - "Send Quote to My Email" (secondary outlined button)
- On submit, call POST /api/send-email with action type ("booking" or "quote") and full form data

### Confirmation State
After successful submission, show inline confirmation (no page redirect):
- "You're all set!" heading
- "We'll be in touch within 24 hours to confirm your pickup window." for bookings
- "Your quote has been sent to [email]." for quote requests
- "Start Over" button that resets the form to Step 1

---

## Distance API Route (app/api/calculate-distance/route.ts)
```ts
// POST handler
// 1. Accept { destination: string } from request body
// 2. Call Google Maps Distance Matrix API
//    - origins: BASE_LOCATION.address
//    - destinations: destination (the customer address)
//    - mode: driving
//    - units: metric
// 3. Parse response, extract distance in km
// 4. Match against DISTANCE_TIERS to get levy
// 5. Return { distanceKm, levy, withinServiceArea: true/false }
// Use GOOGLE_MAPS_API_KEY from env (server-side key, not the public maps key)
```

---

## Email System (app/api/send-email/route.ts)

Install resend. POST endpoint accepts:
```ts
{
  action: 'booking' | 'quote'
  name: string
  email: string
  phone: string
  bin: { key: string; name: string; qty: number; isBase: boolean }[]
  address: string
  pickupType: string
  distanceKm: number
  baseItemPrice: number
  additionalItemsCost: number
  floorSurcharge: number
  distanceLevy: number
  total: number
}
```

### 4 Email Templates (lib/emails.ts)

**1. Customer Booking Confirmation**
Subject: "Your GreenHaul Booking is Confirmed 🟢"
- Thank customer by first name
- Full bin summary (items, qtys, base item noted)
- Pickup address and floor type
- Distance from Onehunga
- Price breakdown (base item / additional items / floor surcharge / distance levy / total NZD)
- "Our team will contact you within 24 hours to confirm your pickup window."
- Tagline footer: "Whiteware gone, the green way."

**2. Admin Booking Notification**
Subject: "New Booking — [Name] — $[Total]"
- Customer: name, phone, email
- Bin: full item list with quantities, base item flagged
- Pickup: full address, floor type, distance in km
- Price breakdown + total
- Timestamp (NZT)

**3. Customer Quote Email**
Subject: "Your GreenHaul Quote 🟢"
- Hi [first name], here is your instant quote
- Full bin summary
- Pickup address, floor type
- Price breakdown + total NZD
- "Quote valid for 7 days."
- CTA: "Ready to Book? Reply to this email or visit greenhaul.kiwi"
- Tagline footer: "Whiteware gone, the green way."

**4. Admin Quote Notification**
Subject: "New Quote Request — [Name] — $[Total]"
- Same fields as admin booking but labelled "Quote Request"
- Timestamp (NZT)

Use from: "GreenHaul <noreply@greenhaul.kiwi>"
Admin to: ADMIN_EMAIL env var

---

## FAQ Section (components/FAQ.tsx)

Accordion component. Q&As:

1. **What areas do you service?** Currently Auckland (within 100 km of Onehunga). More regions coming soon.
2. **How is my price calculated?** Based on your items, floor access, and distance from our base in Onehunga. The highest-value item sets the base price — extra items on the same trip are heavily discounted since the truck is already there.
3. **What happens to my old appliances?** We dispose of all whiteware responsibly, following NZ waste guidelines. Where possible, items are recycled or refurbished.
4. **How soon can you collect?** We aim to book collections within 2–3 business days. We'll confirm your time window by phone or email within 24 hours.
5. **Do I need to be home?** Yes, someone needs to be present or the item must be accessible at the agreed location.
6. **Can I add more than one item?** Yes — build your bin with as many items as you need. Extra items on the same trip are priced at a discounted rate.
7. **Is there a cancellation policy?** You can cancel or reschedule up to 24 hours before your booking at no charge.

---

## Environment Variables (.env.local)