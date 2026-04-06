'use client'

import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-black/[0.06] transition-all duration-300 ${
        scrolled ? 'bg-cream/80 backdrop-blur-[12px]' : 'bg-cream'
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <a href="/" className="font-display text-[22px] font-normal tracking-tight leading-none">
          <span className="text-ink">haul</span>
          <span className="text-green-500">.green</span>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-[14px] text-ink-muted hover:text-ink transition-colors duration-200"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="text-[14px] text-ink-muted hover:text-ink transition-colors duration-200"
          >
            FAQ
          </a>
        </nav>

        {/* CTA */}
        <a
          href="#price-form"
          className="h-9 px-4 bg-green-800 text-white text-[13px] font-medium rounded-[2px] hover:bg-green-700 transition-all duration-200 flex items-center active:scale-[0.98]"
        >
          Get instant price
        </a>
      </div>
    </header>
  )
}
