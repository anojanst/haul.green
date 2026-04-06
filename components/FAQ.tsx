'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const faqs = [
  {
    q: 'What areas do you service?',
    a: 'Currently Auckland (within 100 km of Onehunga). More regions coming soon.',
  },
  {
    q: 'How is my price calculated?',
    a: "Based on your items, floor access, and distance from our base in Onehunga. The highest-value item sets the base price — extra items on the same trip are heavily discounted since the truck is already there.",
  },
  {
    q: 'What happens to my old appliances?',
    a: 'We dispose of all whiteware responsibly, following NZ waste guidelines. Where possible, items are recycled or refurbished.',
  },
  {
    q: 'How soon can you collect?',
    a: "We aim to book collections within 2–3 business days. We'll confirm your time window by phone or email within 24 hours.",
  },
  {
    q: 'Do I need to be home?',
    a: 'Yes, someone needs to be present or the item must be accessible at the agreed location.',
  },
  {
    q: 'Can I add more than one item?',
    a: 'Yes — build your bin with as many items as you need. Extra items on the same trip are priced at a discounted rate.',
  },
  {
    q: 'Is there a cancellation policy?',
    a: 'You can cancel or reschedule up to 24 hours before your booking at no charge.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-[120px] px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid lg:grid-cols-[360px,1fr] gap-16 lg:gap-24">

          {/* Left: Sticky heading */}
          <ScrollReveal>
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-green-500 mb-4">
                • faq
              </p>
              <h2 className="font-display font-normal text-[32px] sm:text-[42px] text-ink leading-tight tracking-[-0.01em] mb-4">
                Common<br />questions.
              </h2>
              <p className="text-[15px] font-light text-ink-muted leading-relaxed">
                Can&apos;t find what you&apos;re looking for?{' '}
                <a
                  href="mailto:hello@haul.green"
                  className="text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  Email us.
                </a>
              </p>
            </div>
          </ScrollReveal>

          {/* Right: Accordion */}
          <div>
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 40}>
                <div className="border-b border-black/[0.07] first:border-t first:border-t-black/[0.07]">
                  <button
                    className={`flex w-full items-start justify-between py-6 text-left gap-8 transition-colors duration-200 ${
                      open === i ? 'text-green-700' : 'text-ink hover:text-green-700'
                    }`}
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    <span className="text-[17px] font-medium leading-snug">{faq.q}</span>
                    <span
                      className={`shrink-0 mt-0.5 text-green-600 transition-transform duration-200 ${
                        open === i ? 'rotate-45' : ''
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      open === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-[15px] font-light text-ink-muted leading-[1.7]">{faq.a}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
