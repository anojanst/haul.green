'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

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
  return (
    <section id="faq" className="max-w-2xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
        Frequently Asked Questions
      </h2>
      <Accordion.Root type="multiple" className="space-y-2">
        {faqs.map((faq, i) => (
          <Accordion.Item
            key={i}
            value={`item-${i}`}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors group">
                {faq.q}
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0 ml-2" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-5 pb-4 text-gray-600 text-sm leading-relaxed data-[state=open]:animate-none">
              {faq.a}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  )
}
