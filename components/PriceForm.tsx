'use client'

import { useState, useCallback, useRef } from 'react'
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
  Home,
  ChevronUp,
  ArrowUp,
  ArrowUpCircle,
} from 'lucide-react'
import { ITEM_PRICES, ADDITIONAL_ITEM_RATE, PICKUP_SURCHARGES } from '@/lib/pricing'
import AddressAutocomplete from './AddressAutocomplete'

const ITEM_ICONS: Record<string, React.ReactNode> = {
  fridge:          <Refrigerator className="w-5 h-5" />,
  washing_machine: <WashingMachine className="w-5 h-5" />,
  dryer:           <Wind className="w-5 h-5" />,
  dishwasher:      <Utensils className="w-5 h-5" />,
  oven:            <Flame className="w-5 h-5" />,
  freezer:         <Snowflake className="w-5 h-5" />,
  tv:              <Tv className="w-5 h-5" />,
  microwave:       <Microwave className="w-5 h-5" />,
  other:           <Package className="w-5 h-5" />,
}

const PICKUP_ICONS: Record<string, React.ReactNode> = {
  driveway:         <Home className="w-4 h-4" />,
  first_floor:      <ChevronUp className="w-4 h-4" />,
  second_no_lift:   <ArrowUp className="w-4 h-4" />,
  second_with_lift: <ArrowUpCircle className="w-4 h-4" />,
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
  const formRef = useRef<HTMLElement>(null)

  function goToStep(n: number) {
    setStep(n)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

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
  const [additionalInfo, setAdditionalInfo] = useState('')
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
          additionalInfo,
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
    setAdditionalInfo('')
    setConfirmation(null)
    setStep(1)
  }

  /* ── Confirmation ── */
  if (confirmation) {
    return (
      <div className="max-w-[780px] mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(10,26,15,0.08)] p-12 text-center">
          <div className="flex justify-center mb-8">
            <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
              <circle
                cx="40" cy="40" r="36"
                stroke="#3a8a52" strokeWidth="2.5"
                strokeDasharray="226" strokeDashoffset="226"
                style={{ animation: 'drawCircle 0.6s ease 0.1s forwards' }}
              />
              <polyline
                points="22,40 35,53 58,27"
                stroke="#3a8a52" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="60" strokeDashoffset="60"
                style={{ animation: 'drawCheck 0.4s ease 0.7s forwards' }}
              />
            </svg>
          </div>
          <h2 className="font-display text-[38px] font-normal text-ink mb-4 tracking-tight">
            You&apos;re all set!
          </h2>
          {confirmation.action === 'booking' ? (
            <p className="text-[16px] font-light text-ink-muted mb-10 max-w-sm mx-auto leading-relaxed">
              We&apos;ll be in touch within 24 hours to confirm your pickup window.
            </p>
          ) : (
            <p className="text-[16px] font-light text-ink-muted mb-10 max-w-sm mx-auto leading-relaxed">
              Your quote has been sent to{' '}
              <span className="font-medium text-ink">{confirmation.email}</span>.
            </p>
          )}
          <button
            onClick={reset}
            className="h-11 px-7 border border-green-800 text-green-800 text-[14px] font-medium rounded-[2px] hover:bg-green-50 transition-all duration-200 active:scale-[0.98]"
          >
            Start over
          </button>
        </div>
      </div>
    )
  }

  /* ── Step indicator ── */
  const steps = [
    { n: 1, label: 'Your bin' },
    { n: 2, label: 'Pickup' },
    { n: 3, label: 'Details' },
  ]

  return (
    <section id="price-form" ref={formRef} className="max-w-[960px] mx-auto scroll-mt-20">
      {/* Dots */}
      <div className="flex items-start justify-center mb-10">
        {steps.map(({ n, label }, idx) => (
          <div key={n} className="flex items-start">
            <div className="flex flex-col items-center gap-2 min-w-[64px]">
              <div
                className={`w-[10px] h-[10px] rounded-full transition-all duration-300 ${
                  n < step
                    ? 'bg-green-500'
                    : n === step
                    ? 'bg-green-800 scale-110'
                    : 'bg-green-200'
                }`}
              />
              <span
                className={`text-[11px] font-medium text-center whitespace-nowrap transition-colors duration-200 ${
                  n === step ? 'text-ink' : 'text-ink-faint'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-16 sm:w-28 h-px mt-[4px] mx-2 transition-all duration-300 ${
                  n < step ? 'bg-green-500' : 'bg-green-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(10,26,15,0.08)] overflow-hidden">
        <div key={step} className="p-8 md:p-10 animate-fade-in">

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-[28px] font-normal text-ink mb-1.5 tracking-tight">
                Build your bin
              </h2>
              <p className="text-[14px] font-light text-ink-muted mb-8">
                Select the appliances you&apos;d like removed.
              </p>

              <div className="grid lg:grid-cols-[1fr,260px] gap-8 items-start">

                {/* Left: item grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(ITEM_PRICES).map(([key, item]) => {
                    const qty = bin[key] ?? 0
                    const isBase = key === pricing.baseKey
                    return (
                      <div
                        key={key}
                        className={`relative rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all duration-200 ${
                          qty > 0
                            ? isBase
                              ? 'border-green-600 bg-green-50 shadow-[0_2px_12px_rgba(42,106,63,0.14)]'
                              : 'border-green-400 bg-green-50'
                            : 'border-green-100 bg-white hover:border-green-400 hover:shadow-[0_2px_12px_rgba(42,106,63,0.08)] hover:-translate-y-0.5'
                        }`}
                      >
                        {isBase && qty > 0 && (
                          <span className="absolute top-2 right-2 text-[9px] font-medium uppercase tracking-wider bg-green-800 text-white px-1.5 py-0.5 rounded-[2px]">
                            base
                          </span>
                        )}
                        <div
                          className={`transition-colors duration-200 ${
                            qty > 0 ? 'text-green-600' : 'text-ink-faint'
                          }`}
                        >
                          {ITEM_ICONS[key]}
                        </div>
                        <span className="text-[12px] font-medium text-center text-ink leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-ink-faint">${item.price}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateBin(key, -1)}
                            disabled={qty === 0}
                            className="w-7 h-7 rounded-full border border-green-200 flex items-center justify-center text-ink-muted hover:border-green-500 hover:text-green-700 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-150"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center text-[14px] font-medium text-ink">{qty}</span>
                          <button
                            onClick={() => updateBin(key, 1)}
                            className="w-7 h-7 rounded-full border border-green-600 text-green-700 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-150"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Right: sticky summary panel */}
                <div className="lg:sticky lg:top-28">
                  <div className="bg-green-50 rounded-xl border border-green-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-green-200">
                      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-green-600">
                        Your bin
                      </p>
                    </div>

                    <div className="px-5 py-4 min-h-[140px]">
                      {totalQty === 0 ? (
                        <p className="text-[13px] text-ink-faint leading-relaxed">
                          No items selected yet. Add appliances from the left to see your price.
                        </p>
                      ) : (
                        <ul className="space-y-2.5">
                          {binItems.map((item) => (
                            <li key={item.key} className="flex items-center justify-between">
                              <span className="text-[13px] text-ink-muted flex items-center gap-2">
                                {item.name}
                                {item.isBase && (
                                  <span className="text-[9px] font-medium uppercase tracking-wider bg-green-800 text-white px-1.5 py-0.5 rounded-[2px]">
                                    base
                                  </span>
                                )}
                              </span>
                              <span className="text-[13px] text-ink-faint shrink-0 ml-2">×{item.qty}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="px-5 py-4 border-t border-green-200">
                      <div className="flex justify-between items-baseline mb-5">
                        <span className="text-[12px] font-medium text-ink-muted uppercase tracking-[0.08em]">
                          Subtotal
                        </span>
                        <span className="font-display italic text-[26px] text-green-800">
                          ${pricing.baseItemPrice + pricing.additionalItemsCost}
                        </span>
                      </div>
                      <button
                        disabled={totalQty === 0}
                        onClick={() => goToStep(2)}
                        className="w-full h-11 bg-green-800 text-white font-medium rounded-[2px] hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99] text-[14px]"
                      >
                        Pickup details →
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-[28px] font-normal text-ink mb-1.5 tracking-tight">
                Pickup details
              </h2>
              <p className="text-[14px] font-light text-ink-muted mb-8">
                Tell us where to collect and how to access the items.
              </p>

              <div className="grid lg:grid-cols-[1fr,260px] gap-8 items-start">

                {/* Left: form fields */}
                <div>
                  {/* Address */}
                  <div className="mb-6">
                    <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">
                      Pickup address
                    </label>
                    <AddressAutocomplete onAddressSelect={handleAddressSelect} />

                    {distanceLoading && (
                      <div className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-faint">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Calculating distance…
                      </div>
                    )}
                    {distanceError && (
                      <p className="mt-2 text-[13px] text-red-600">{distanceError}</p>
                    )}
                    {distanceResult && !distanceResult.withinServiceArea && (
                      <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-[14px] font-medium text-amber-800 mb-2">
                          Sorry, we don&apos;t currently service this area. We&apos;re expanding soon — enter your email to be notified.
                        </p>
                        {outOfAreaSubmitted ? (
                          <p className="text-[13px] text-green-700 font-medium">
                            Thanks! We&apos;ll let you know when we reach you.
                          </p>
                        ) : (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault()
                              setOutOfAreaSubmitted(true)
                              await fetch('/api/notify-area', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: outOfAreaEmail }),
                              }).catch(() => {})
                            }}
                            className="flex gap-2"
                          >
                            <input
                              type="email"
                              required
                              value={outOfAreaEmail}
                              onChange={(e) => setOutOfAreaEmail(e.target.value)}
                              placeholder="your@email.com"
                              className="flex-1 border border-amber-300 rounded-[4px] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 text-[13px]"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 bg-amber-500 text-white rounded-[2px] text-[13px] font-medium hover:bg-amber-600 transition-colors"
                            >
                              Notify me
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                    {distanceResult?.withinServiceArea && (
                      <div
                        className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border ${
                          distanceResult.levy > 0
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }`}
                      >
                        📍 {distanceResult.distanceKm} km from us
                        {distanceResult.levy > 0 ? ` — +$${distanceResult.levy} levy` : ' — no levy'}
                      </div>
                    )}
                  </div>

                  {/* Pickup type — button cards */}
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint mb-3">
                      Floor / access type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(PICKUP_SURCHARGES).map(([key, val]) => (
                        <button
                          key={key}
                          onClick={() => setPickupType(key)}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                            pickupType === key
                              ? 'bg-green-800 border-green-800 text-white'
                              : 'bg-white border-green-100 text-ink hover:border-green-400'
                          }`}
                        >
                          <span className={`shrink-0 ${pickupType === key ? 'text-green-300' : 'text-ink-faint'}`}>
                            {PICKUP_ICONS[key]}
                          </span>
                          <div>
                            <p className={`text-[12px] font-medium leading-snug ${pickupType === key ? 'text-white' : 'text-ink'}`}>
                              {val.label}
                            </p>
                            <p className={`text-[11px] mt-0.5 ${pickupType === key ? 'text-green-300' : 'text-ink-faint'}`}>
                              {val.surcharge > 0 ? `+$${val.surcharge}` : 'No surcharge'}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: sticky summary panel */}
                <div className="lg:sticky lg:top-28">
                  <div className="bg-green-50 rounded-xl border border-green-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-green-200">
                      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-green-600">
                        Price summary
                      </p>
                    </div>

                    <div className="px-5 py-4 space-y-2.5">
                      <div className="flex justify-between text-[13px] text-ink-muted">
                        <span>Items subtotal</span>
                        <span>${pricing.baseItemPrice + pricing.additionalItemsCost}</span>
                      </div>
                      {pricing.floorSurcharge > 0 && (
                        <div className="flex justify-between text-[13px] text-ink-muted">
                          <span>Floor surcharge</span>
                          <span>+${pricing.floorSurcharge}</span>
                        </div>
                      )}
                      {distanceLoading ? (
                        <div className="flex justify-between text-[13px] text-ink-faint">
                          <span>Distance levy</span>
                          <span className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> …
                          </span>
                        </div>
                      ) : pricing.distanceLevy > 0 && (
                        <div className="flex justify-between text-[13px] text-ink-muted">
                          <span>Distance levy</span>
                          <span>+${pricing.distanceLevy}</span>
                        </div>
                      )}
                    </div>

                    <div className="px-5 py-4 border-t border-green-200">
                      <div className="flex justify-between items-baseline mb-5">
                        <span className="text-[12px] font-medium text-ink-muted uppercase tracking-[0.08em]">
                          Total
                        </span>
                        <span className="font-display italic text-[26px] text-green-800">
                          ${pricing.total}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => goToStep(1)}
                          className="h-11 px-4 border border-green-200 text-ink-muted rounded-[2px] hover:border-green-400 hover:text-ink transition-all duration-200 text-[13px]"
                        >
                          ←
                        </button>
                        <button
                          disabled={!address || distanceLoading || !distanceResult?.withinServiceArea}
                          onClick={() => goToStep(3)}
                          className="flex-1 h-11 bg-green-800 text-white font-medium rounded-[2px] hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99] text-[14px]"
                        >
                          Your details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-[28px] font-normal text-ink mb-1.5 tracking-tight">
                Your details
              </h2>
              <p className="text-[14px] font-light text-ink-muted mb-8">
                Almost there — we&apos;ll confirm by phone or email within 24 hours.
              </p>

              <div className="grid lg:grid-cols-[1fr,320px] gap-8 items-start">

                {/* Left: contact fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full h-12 border border-green-100 rounded-[4px] px-4 text-[15px] text-ink font-light focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition-all duration-200 bg-white placeholder:text-ink-faint"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="021 XXX XXXX"
                      className="w-full h-12 border border-green-100 rounded-[4px] px-4 text-[15px] text-ink font-light focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition-all duration-200 bg-white placeholder:text-ink-faint"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full h-12 border border-green-100 rounded-[4px] px-4 text-[15px] text-ink font-light focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition-all duration-200 bg-white placeholder:text-ink-faint"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">
                      Additional info{' '}
                      <span className="normal-case tracking-normal text-ink-faint/60 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Access instructions, preferred time, anything else we should know…"
                      rows={3}
                      className="w-full border border-green-100 rounded-[4px] px-4 py-3 text-[15px] text-ink font-light focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition-all duration-200 bg-white placeholder:text-ink-faint resize-none"
                    />
                  </div>
                </div>

                {/* Right: sticky order summary + actions */}
                <div className="lg:sticky lg:top-28">
                  <div className="bg-green-50 rounded-xl border border-green-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-green-200">
                      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-green-600">
                        Order summary
                      </p>
                    </div>

                    <div className="px-5 py-4 space-y-2">
                      {binItems.map((item) => (
                        <div key={item.key} className="flex items-center justify-between text-[13px]">
                          <span className="text-ink-muted flex items-center gap-1.5">
                            {item.name} ×{item.qty}
                            {item.isBase && (
                              <span className="text-[9px] font-medium uppercase tracking-wider bg-green-800 text-white px-1.5 py-0.5 rounded-[2px]">
                                base
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-green-200 pt-2.5 mt-1 space-y-2">
                        <div className="flex justify-between text-[13px] text-ink-muted">
                          <span>Items subtotal</span>
                          <span>${pricing.baseItemPrice + pricing.additionalItemsCost}</span>
                        </div>
                        {pricing.floorSurcharge > 0 && (
                          <div className="flex justify-between text-[13px] text-ink-muted">
                            <span>Floor surcharge</span>
                            <span>+${pricing.floorSurcharge}</span>
                          </div>
                        )}
                        {pricing.distanceLevy > 0 && (
                          <div className="flex justify-between text-[13px] text-ink-muted">
                            <span>Distance levy ({distanceResult?.distanceKm} km)</span>
                            <span>+${pricing.distanceLevy}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-4 border-t border-green-200 space-y-2">
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[12px] font-medium text-ink-muted uppercase tracking-[0.08em]">
                          Total NZD
                        </span>
                        <span className="font-display italic text-[26px] text-green-800">
                          ${pricing.total}
                        </span>
                      </div>
                      <button
                        disabled={!name || !phone || !email || submitting}
                        onClick={() => handleSubmit('booking')}
                        className="w-full h-11 bg-green-800 text-white font-medium rounded-[2px] hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 text-[14px]"
                      >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Book now →
                      </button>
                      <button
                        disabled={!name || !phone || !email || submitting}
                        onClick={() => handleSubmit('quote')}
                        className="w-full h-11 border border-green-800 text-green-800 font-medium rounded-[2px] hover:bg-green-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-[13px]"
                      >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Send quote to email
                      </button>
                      <button
                        onClick={() => goToStep(2)}
                        className="w-full h-9 text-[12px] text-ink-faint hover:text-ink-muted transition-colors duration-200"
                      >
                        ← Back
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
