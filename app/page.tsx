import { Truck, Calendar, DollarSign } from 'lucide-react'
import PriceForm from '@/components/PriceForm'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-green-800 to-green-700 text-white py-24 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Whiteware gone,<br className="hidden sm:block" /> the green way.
        </h1>
        <p className="text-green-100 text-lg sm:text-xl mb-8 max-w-xl mx-auto">
          Instant pricing. Doorstep pickup. No hassle.
        </p>
        <a
          href="#price-form"
          className="inline-block px-8 py-3 bg-white text-green-800 font-bold rounded-xl text-lg hover:bg-green-50 transition-colors shadow-lg"
        >
          Get My Instant Price
        </a>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-10">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-green-800" />
            </div>
            <h3 className="font-bold text-gray-800">1. Select Items</h3>
            <p className="text-gray-500 text-sm">
              Choose the appliances you want removed and build your bin.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Truck className="w-8 h-8 text-green-800" />
            </div>
            <h3 className="font-bold text-gray-800">2. Choose Pickup</h3>
            <p className="text-gray-500 text-sm">
              Enter your address and floor access for an accurate quote.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-green-800" />
            </div>
            <h3 className="font-bold text-gray-800">3. Get Instant Price</h3>
            <p className="text-gray-500 text-sm">
              See your total instantly and book or request a quote by email.
            </p>
          </div>
        </div>
      </section>

      {/* ── Price Form ── */}
      <div className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 pt-12 mb-2">
            Get Your Instant Price
          </h2>
          <p className="text-center text-gray-500 mb-4">
            No obligation — book online or get a quote sent to your inbox.
          </p>
        </div>
        <PriceForm />
      </div>

      {/* ── FAQ ── */}
      <div className="border-t border-gray-100">
        <FAQ />
      </div>
    </>
  )
}
