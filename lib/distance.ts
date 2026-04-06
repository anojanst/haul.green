import { BASE_LOCATION, DISTANCE_TIERS, SERVICE_RADIUS_KM } from './pricing'

export async function calculateDistance(destination: string): Promise<{
  distanceKm: number
  levy: number
  withinServiceArea: boolean
} | { error: string }> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return { error: 'Google Maps API key not configured' }
  }

  const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'routes.distanceMeters',
    },
    body: JSON.stringify({
      origin: { address: BASE_LOCATION.address },
      destination: { address: destination },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_UNAWARE',
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('Routes API error:', errText)
    return { error: 'Failed to contact Routes API' }
  }

  const data = await res.json()

  if (!data.routes?.[0]?.distanceMeters) {
    return { error: 'Could not calculate distance for that address' }
  }

  const metres = data.routes[0].distanceMeters as number
  const distanceKm = Math.ceil(metres / 1000)

  if (distanceKm > SERVICE_RADIUS_KM) {
    return { distanceKm, levy: 0, withinServiceArea: false }
  }

  const tier = DISTANCE_TIERS.find((t) => distanceKm <= t.maxKm)
  const levy = tier ? tier.levy : 30

  return { distanceKm, levy, withinServiceArea: true }
}
