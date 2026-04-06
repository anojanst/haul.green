import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GreenHaul | Whiteware Removal & Disposal NZ',
  description:
    'Book doorstep whiteware collection across NZ. Get instant pricing for fridge, washing machine, dryer and appliance removal. Fast, affordable, eco-friendly.',
  keywords: [
    'whiteware removal NZ',
    'appliance disposal',
    'fridge removal',
    'washing machine removal',
    'dryer disposal Auckland',
    'GreenHaul',
  ],
  metadataBase: new URL('https://haul.green'),
  alternates: { canonical: 'https://haul.green' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://haul.green',
    title: 'GreenHaul | Whiteware Removal & Disposal NZ',
    description:
      'Book doorstep whiteware collection across NZ. Get instant pricing for fridge, washing machine, dryer and appliance removal. Fast, affordable, eco-friendly.',
    images: [{ url: 'https://haul.green/og-image.jpg', width: 1200, height: 630 }],
    siteName: 'GreenHaul',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GreenHaul | Whiteware Removal & Disposal NZ',
    description:
      'Book doorstep whiteware collection across NZ. Get instant pricing for fridge, washing machine, dryer and appliance removal.',
    images: ['https://haul.green/og-image.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'GreenHaul',
  description: 'Whiteware removal and disposal service in New Zealand',
  url: 'https://haul.green',
  email: 'hello@haul.green',
  areaServed: {
    '@type': 'Country',
    name: 'New Zealand',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Whiteware Removal',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Whiteware Removal' } },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        {/* Sticky header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-2xl font-extrabold text-green-800 tracking-tight">
              GreenHaul
            </a>
            <a
              href="#price-form"
              className="px-4 py-2 bg-green-800 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Get Instant Price
            </a>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-green-800 text-white mt-16">
          <div className="max-w-5xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8">
            <div>
              <p className="text-xl font-extrabold mb-1">GreenHaul</p>
              <p className="text-green-200 text-sm italic">Whiteware gone, the green way.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Links</p>
              <ul className="space-y-1 text-sm text-green-200">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                <li><a href="mailto:hello@haul.green" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Contact</p>
              <a href="mailto:hello@haul.green" className="text-green-200 text-sm hover:text-white">
                hello@haul.green
              </a>
            </div>
          </div>
          <div className="border-t border-green-700 text-center text-green-300 text-xs py-4">
            © {new Date().getFullYear()} GreenHaul. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
