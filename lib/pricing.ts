export const ITEM_PRICES: Record<string, { name: string; price: number }> = {
  fridge:          { name: 'Fridge',            price: 65 },
  washing_machine: { name: 'Washing Machine',   price: 60 },
  dryer:           { name: 'Dryer',             price: 55 },
  dishwasher:      { name: 'Dishwasher',        price: 55 },
  oven:            { name: 'Oven / Stove',      price: 60 },
  freezer:         { name: 'Freezer',           price: 60 },
  tv:              { name: 'TV',                price: 45 },
  microwave:       { name: 'Microwave',         price: 35 },
  other:           { name: 'Other Appliance',   price: 40 },
}

export const ADDITIONAL_ITEM_RATE = 15

export const PICKUP_SURCHARGES: Record<string, { label: string; surcharge: number }> = {
  driveway:         { label: 'Driveway / Ground Floor',         surcharge: 0  },
  first_floor:      { label: 'First Floor',                     surcharge: 20 },
  second_no_lift:   { label: '2nd Floor or Above — No Lift',    surcharge: 50 },
  second_with_lift: { label: '2nd Floor or Above — With Lift',  surcharge: 30 },
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
