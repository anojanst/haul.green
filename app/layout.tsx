import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

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
  areaServed: { '@type': 'Country', name: 'New Zealand' },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-cream text-ink">
        <Header />
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-green-950 text-white">
          <div className="max-w-[1100px] mx-auto px-6 py-16 grid sm:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <p className="font-display text-[22px] font-normal mb-3 leading-none">
                <span className="text-white">haul</span>
                <span className="text-green-400">.green</span>
              </p>
              <p className="font-display italic text-green-300 text-[18px] font-light leading-snug">
                Whiteware gone,<br />the green way.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-green-500 mb-4">
                Links
              </p>
              <ul className="space-y-2.5 text-[14px] text-green-300">
                <li>
                  <a href="/" className="hover:text-white transition-colors duration-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors duration-200">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-green-500 mb-4">
                Contact
              </p>
              <a
                href="mailto:hello@haul.green"
                className="text-[14px] text-green-300 hover:text-white transition-colors duration-200"
              >
                hello@haul.green
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-green-800">
            <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
              <p className="text-[12px] text-green-500 font-medium">
                © {new Date().getFullYear()} GreenHaul
              </p>
              <p className="text-[12px] text-green-700">
                Auckland <span className="mx-1.5">•</span> New Zealand
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
