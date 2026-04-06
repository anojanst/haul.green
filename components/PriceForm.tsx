'use client'

import { useState, useCallback } from 'react'
import {
  Refrigerator,
  WashingMachine,
  Wind,
  Utensils,
  Flame,
  Snowflake,
  Tv,
  Microwave,
  Package,
  Minus,
  Plus,
  Loader2,
} from 'lucide-react'
import { ITEM_PRICES, ADDITIONAL_ITEM_RATE, PICKUP_SURCHARGES } from '@/lib/pricing'
import AddressAutocomplete from './AddressAutocomplete'

const ITEM_ICONS: Record<string, React.ReactNode> = {
  fridge:          <Refrigerator className="w-8 h-8" />,
  washing_machine: <WashingMachine className="w-8 h-8" />,
  dryer:           <Wind className="w-8 h-8" />,
  dishwasher:      <Utensils className="w-8 h-8" />,
  oven:            <Flame className="w-8 h-8" />,
  freezer:         <Snowflake className="w-8 h-8" />,
  tv:              <Tv className="w-8 h-8" />,
  microwave:       <Microwave className="w-8 h-8" />,
  other:           <Package className="w-8 h-8" />,
}

type Bin = Record<string, number>

function computePricing(bin: Bin, pickupType: string, distanceLevy: number) {
  const entries = Object.entries(bin).filter(([, qty]) => qty > 0)
  if (entries.length === 0) {
    return { baseKey: null, baseItemPrice: 0, additionalItemsCost: 0, floorSurcharge: 0, distanceLevy, total: 0 }
  }

  let baseKey = entries[0][0]
  let basePrice = ITEM_PRICES[baseKey].price
  for (const [key] of entries) {
    if (ITEM_PRICES[key].price > basePrice) {
      baseKey = key
      basePrice = ITEM_PRICES[key].price
    }
  }

  const totalQty = entries.reduce((sum, [, qty]) => sum + qty, 0)
  const additionalItemsCost = (totalQty - 1) * ADDITIONAL_ITEM_RATE

  const floorSurcharge = PICKUP_SURCHARGES[pickupType]?.surcharge ?? 0
  const total = basePrice + additionalItemsCost + floorSurcharge + distanceLevy

  return { baseKey, baseItemPrice: basePrice, additionalItemsCost, floorSurcharge, distanceLevy, total }
}

interface DistanceResult {
  distanceKm: number
  levy: number
  withinServiceArea: boolean
}

export default function PriceForm() {
  const [step, setStep] = useState(1)
  const [bin, setBin] = useState<Bin>({})
  const [address, setAddress] = useState('')
  const [pickupType, setPickupType] = useState('driveway')
  const [distanceResult, setDistanceResult] = useState<DistanceResult | null>(null)
  const [distanceLoading, setDistanceLoading] = useState(false)
  const [distanceError, setDistanceError] = useState('')
  const [outOfAreaEmail, setOutOfAreaEmail] = useState('')
  const [outOfAreaSubmitted, setOutOfAreaSubmitted] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<{ action: 'booking' | 'quote'; email: string } | null>(null)

  const levy = distanceResult?.withinServiceArea ? distanceResult.levy : 0
  const pricing = computePricing(bin, pickupType, levy)

  const binItems = Object.entries(bin)
    .filter(([, qty]) => qty > 0)
    .map(([key, qty]) => ({
      key,
      name: ITEM_PRICES[key].name,
      qty,
      isBase: key === pricing.baseKey,
    }))

  const totalQty = Object.values(bin).reduce((s, q) => s + q, 0)

  function updateBin(key: string, delta: number) {
    setBin((prev) => {
      const next = { ...prev }
      next[key] = Math.max(0, (next[key] ?? 0) + delta)
      if (next[key] === 0) delete next[key]
      return next
    })
  }

  const handleAddressSelect = useCallback(async (addr: string) => {
    setAddress(addr)
    setDistanceResult(null)
    setDistanceError('')
    if (!addr) return

    setDistanceLoading(true)
    try {
      const res = await fetch('/api/calculate-distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: addr }),
      })
      const data = await res.json()
      if (data.error) {
        setDistanceError(data.error)
      } else {
        setDistanceResult(data)
      }
    } catch {
      setDistanceError('Failed to calculate distance.')
    } finally {
      setDistanceLoading(false)
    }
  }, [])

  async function handleSubmit(action: 'booking' | 'quote') {
    setSubmitting(true)
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          name,
          email,
          phone,
          bin: binItems,
          address,
          pickupType: PICKUP_SURCHARGES[pickupType]?.label ?? pickupType,
          distanceKm: distanceResult?.distanceKm ?? 0,
          baseItemPrice: pricing.baseItemPrice,
          additionalItemsCost: pricing.additionalItemsCost,
          floorSurcharge: pricing.floorSurcharge,
          distanceLevy: pricing.distanceLevy,
          total: pricing.total,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setConfirmation({ action, email })
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setBin({})
    setAddress('')
    setPickupType('driveway')
    setDistanceResult(null)
    setDistanceError('')
    setName('')
    setPhone('')
    setEmail('')
    setConfirmation(null)
    setStep(1)
  }

  if (confirmation) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-5xl mb-4">🟢</div>
        <h2 className="text-3xl font-bold text-green-800 mb-3">You&apos;re all set!</h2>
        {confirmation.action === 'booking' ? (
          <p className="text-gray-600 mb-6">
            We&apos;ll be in touch within 24 hours to confirm your pickup window.
          </p>
        ) : (
          <p className="text-gray-600 mb-6">
            Your quote has been sent to <strong>{confirmation.email}</strong>.
          </p>
        )}
        <button
          onClick={reset}
          className="px-6 py-2 border border-green-800 text-green-800 rounded-lg hover:bg-green-50 transition-colors"
        >
          Start Over
        </button>
      </div>
    )
  }

  return (
    <section id="price-form" className="max-w-2xl mx-auto py-12 px-4">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s === step
                  ? 'bg-green-800 text-white'
                  : s < step
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className={`w-10 h-0.5 ${s < step ? 'bg-green-800' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-6">Build Your Bin</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {Object.entries(ITEM_PRICES).map(([key, item]) => {
              const qty = bin[key] ?? 0
              const isBase = key === pricing.baseKey
              return (
                <div
                  key={key}
                  className={`rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-colors ${
                    qty > 0
                      ? isBase
                        ? 'border-green-700 bg-green-50'
                        : 'border-green-400 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {isBase && qty > 0 && (
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      base
                    </span>
                  )}
                  <div className="text-green-800">{ITEM_ICONS[key]}</div>
                  <span className="text-sm font-medium text-center text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-500">${item.price}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateBin(key, -1)}
                      disabled={qty === 0}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-semibold">{qty}</span>
                    <button
                      onClick={() => updateBin(key, 1)}
                      className="w-7 h-7 rounded-full border border-green-700 text-green-700 flex items-center justify-center hover:bg-green-50"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bin summary */}
          {totalQty > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Bin Summary</h3>
              <ul className="space-y-1 mb-3">
                {binItems.map((item) => (
                  <li key={item.key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name}{' '}
                      {item.isBase && (
                        <span className="text-xs text-green-700 font-semibold bg-green-100 px-1.5 py-0.5 rounded-full ml-1">
                          base
                        </span>
                      )}
                    </span>
                    <span className="text-gray-500">×{item.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-2 flex justify-between font-semibold text-gray-800">
                <span>Items subtotal</span>
                <span>${pricing.baseItemPrice + pricing.additionalItemsCost}</span>
              </div>
            </div>
          )}

          <button
            disabled={totalQty === 0}
            onClick={() => setStep(2)}
            className="w-full py-3 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next: Pickup Details →
          </button>
        </div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-6">Pickup Details</h2>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
            <AddressAutocomplete onAddressSelect={handleAddressSelect} />

            {distanceLoading && (
              <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin" /> Calculating distance…
              </p>
            )}
            {distanceError && (
              <p className="mt-2 text-sm text-red-600">{distanceError}</p>
            )}
            {distanceResult && !distanceResult.withinServiceArea && (
              <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <p className="font-semibold mb-2">
                  Sorry, we don&apos;t currently service this area. We&apos;re expanding soon — enter your email to be notified.
                </p>
                {outOfAreaSubmitted ? (
                  <p className="text-green-700 font-medium">Thanks! We&apos;ll let you know when we reach you.</p>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setOutOfAreaSubmitted(true)
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="email"
                      required
                      value={outOfAreaEmail}
                      onChange={(e) => setOutOfAreaEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 border border-amber-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 text-sm"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-amber-500 text-white rounded text-sm font-medium hover:bg-amber-600"
                    >
                      Notify Me
                    </button>
                  </form>
                )}
              </div>
            )}
            {distanceResult?.withinServiceArea && (
              <p className="mt-2 text-sm text-green-700 font-medium">
                ✓ {distanceResult.distanceKm} km from Onehunga
                {distanceResult.levy > 0 ? ` — $${distanceResult.levy} distance levy applies` : ' — no distance levy'}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Floor / Access Type</label>
            <select
              value={pickupType}
              onChange={(e) => setPickupType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700 bg-white"
            >
              {Object.entries(PICKUP_SURCHARGES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}{val.surcharge > 0 ? ` (+$${val.surcharge})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Live price summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Price Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items subtotal</span>
                <span>${pricing.baseItemPrice + pricing.additionalItemsCost}</span>
              </div>
              {pricing.floorSurcharge > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Floor surcharge</span>
                  <span>${pricing.floorSurcharge}</span>
                </div>
              )}
              {pricing.distanceLevy > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Distance levy</span>
                  <span>${pricing.distanceLevy}</span>
                </div>
              )}
              {distanceLoading && (
                <div className="flex justify-between text-gray-400 italic">
                  <span>Distance levy</span>
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> calculating…
                  </span>
                </div>
              )}
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-800 text-lg">Total</span>
              <span className="font-bold text-green-800 text-2xl">${pricing.total}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              disabled={!address || distanceLoading || !distanceResult?.withinServiceArea}
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next: Your Details →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3 ── */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-6">Your Details</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="021 XXX XXXX"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
          </div>

          {/* Full price breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
            <ul className="space-y-1 text-sm mb-3">
              {binItems.map((item) => (
                <li key={item.key} className="flex items-center justify-between text-gray-600">
                  <span>
                    {item.name} ×{item.qty}
                    {item.isBase && (
                      <span className="ml-1 text-xs text-green-700 font-semibold bg-green-100 px-1.5 py-0.5 rounded-full">
                        base
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-1 text-sm border-t pt-3">
              <div className="flex justify-between text-gray-600">
                <span>Items subtotal</span>
                <span>${pricing.baseItemPrice + pricing.additionalItemsCost}</span>
              </div>
              {pricing.floorSurcharge > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Floor surcharge</span>
                  <span>${pricing.floorSurcharge}</span>
                </div>
              )}
              {pricing.distanceLevy > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Distance levy ({distanceResult?.distanceKm} km)</span>
                  <span>${pricing.distanceLevy}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-green-800 text-lg pt-1 border-t">
                <span>Total NZD</span>
                <span>${pricing.total}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              disabled={!name || !phone || !email || submitting}
              onClick={() => handleSubmit('booking')}
              className="flex-1 py-3 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Book Now
            </button>
            <button
              disabled={!name || !phone || !email || submitting}
              onClick={() => handleSubmit('quote')}
              className="flex-1 py-3 border-2 border-green-800 text-green-800 font-semibold rounded-xl hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Quote to My Email
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
