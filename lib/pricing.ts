export const ITEM_PRICES: Record<string, { name: string; price: number }> = {
  fridge:          { name: 'Fridge',            price: 50 },
  washing_machine: { name: 'Washing Machine',   price: 40 },
  dryer:           { name: 'Dryer',             price: 40 },
  dishwasher:      { name: 'Dishwasher',        price: 40 },
  oven:            { name: 'Oven / Stove',      price: 40 },
  freezer:         { name: 'Freezer',           price: 50 },
  tv:              { name: 'TV',                price: 20 },
  microwave:       { name: 'Microwave',         price: 20 },
  other:           { name: 'Other Appliance',   price: 20 },
}

export const ADDITIONAL_ITEM_RATE = 15

export const PICKUP_SURCHARGES: Record<string, { label: string; surcharge: number }> = {
  driveway:         { label: 'Driveway',         surcharge: 0  },
  first_floor:      { label: 'Ground Floor / First Floor',                     surcharge: 15 },
  second_no_lift:   { label: '2nd Floor or Above — No Lift',    surcharge: 40 },
  second_with_lift: { label: '2nd Floor or Above — With Lift',  surcharge: 25 },
}

export const DISTANCE_TIERS = [
  { maxKm: 20,  levy: 0  },
  { maxKm: 40,  levy: 10 },
  { maxKm: 70,  levy: 20 },
  { maxKm: 100, levy: 30 },
]

export const BASE_LOCATION = {
  address: 'Onehunga, Auckland, New Zealand',
  lat: -36.9209,
  lng: 174.7868,
}

export const SERVICE_RADIUS_KM = 100
