'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

interface Props {
  onAddressSelect: (address: string) => void
}

let placesPromise: Promise<void> | null = null

function loadPlaces(apiKey: string): Promise<void> {
  if (placesPromise) return placesPromise
  setOptions({ key: apiKey, v: 'weekly' })
  placesPromise = importLibrary('places').then(() => {})
  return placesPromise
}

interface Suggestion {
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  placePrediction: any
}

export default function AddressAutocomplete({ onAddressSelect }: Props) {
  const [ready, setReady] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onAddressSelectRef = useRef(onAddressSelect)
  useEffect(() => { onAddressSelectRef.current = onAddressSelect }, [onAddressSelect])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  useEffect(() => {
    if (!apiKey) return
    loadPlaces(apiKey).then(() => setReady(true))
  }, [apiKey])

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input || input.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { AutocompleteSuggestion } = (window as any).google.maps.places
      const { suggestions: raw } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        includedRegionCodes: ['NZ'],
      })
      const mapped: Suggestion[] = (raw ?? []).map((s: any) => ({
        label: s.placePrediction?.text?.text ?? '',
        placePrediction: s.placePrediction,
      }))
      setSuggestions(mapped)
      setOpen(mapped.length > 0)
    } catch (err) {
      console.error('[Autocomplete] fetchAutocompleteSuggestions error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 250)
  }

  const handleSelect = async (suggestion: Suggestion) => {
    setOpen(false)
    setSuggestions([])
    try {
      const place = suggestion.placePrediction.toPlace()
      await place.fetchFields({ fields: ['formattedAddress'] })
      const addr: string = place.formattedAddress ?? ''
      setInputValue(addr)
      onAddressSelectRef.current(addr)
    } catch (err) {
      console.error('[Autocomplete] fetchFields error:', err)
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInput}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={ready ? 'Start typing your address…' : 'Loading address lookup…'}
        disabled={!ready}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
      />
      {loading && (
        <div className="absolute right-3 top-3.5 text-xs text-gray-400">searching…</div>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(s)}
              className="px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-green-50 hover:text-green-800 border-b border-gray-100 last:border-0"
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
