import Image from 'next/image'
import PriceForm from '@/components/PriceForm'
import FAQ from '@/components/FAQ'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="min-h-[85vh] flex items-center bg-cream overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div>
              <p className="hero-eyebrow text-[11px] font-medium uppercase tracking-[0.1em] text-green-500 mb-6 flex items-center gap-2">
                <span className="text-green-400">•</span>
                Auckland&apos;s green haulers
              </p>
              <h1 className="hero-headline font-display font-light leading-[1.05] tracking-[-0.02em] text-ink mb-6 text-[44px] sm:text-[58px] lg:text-[68px]">
                Whiteware gone,<br />
                the green way.
              </h1>
              <p className="hero-sub text-[20px] font-light text-ink-muted mb-10 leading-relaxed max-w-md">
                Instant pricing. Doorstep pickup. No fuss.
              </p>
              <div
                className="hero-sub flex items-center gap-5 flex-wrap"
                style={{ animationDelay: '320ms' }}
              >
                <a
                  href="#price-form"
                  className="inline-flex items-center gap-2 h-12 px-7 bg-green-800 text-white font-medium rounded-[2px] hover:bg-green-700 transition-all duration-200 active:scale-[0.98] text-[15px] whitespace-nowrap shrink-0"
                >
                  Get my instant price →
                </a>
                <div className="flex items-center gap-4 text-[13px] text-ink-faint whitespace-nowrap">
                  <span>✓ No hidden fees</span>
                  <span>✓ Auckland-wide</span>
                  <span>✓ Eco-responsible</span>
                </div>
              </div>
            </div>

            {/* Right: Hero image (desktop only) */}
            <div className="hidden lg:flex items-center justify-center">
              <Image
                src="/hero.png"
                alt="GreenHaul whiteware removal"
                width={560}
                height={560}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-[120px] px-6">
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-green-500 mb-4">
              • how it works
            </p>
            <h2 className="font-display font-normal text-[32px] sm:text-[42px] text-ink mb-16 leading-tight tracking-[-0.01em]">
              Three steps to a<br />cleaner home.
            </h2>
          </ScrollReveal>

          <div className="relative grid sm:grid-cols-3 gap-12">

            {[
              {
                num: '01',
                title: 'Select items',
                desc: 'Build your bin with the appliances you want removed. Extra items on the same trip are discounted.',
              },
              {
                num: '02',
                title: 'Choose pickup',
                desc: 'Enter your address and floor access. We calculate the distance and give you a fixed, transparent price.',
              },
              {
                num: '03',
                title: 'Get your price',
                desc: 'See your total instantly — then book online or get the quote sent straight to your inbox.',
              },
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 120}>
                <div className="relative pt-24">
                  <span
                    className="font-display italic text-green-200 absolute top-0 left-0 leading-none select-none pointer-events-none"
                    style={{ fontSize: '80px', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {step.num}
                  </span>
                  <div className="relative z-10">
                    <h3 className="font-display text-[22px] text-ink mb-2 font-normal">
                      {step.title}
                    </h3>
                    <p className="text-[15px] font-light text-ink-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Price Form ── */}
      <div
        className="py-[120px]"
        style={{
          backgroundColor: 'var(--green-50)',
          backgroundImage: 'radial-gradient(circle, var(--green-200) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="max-w-[1100px] mx-auto px-6">
          <ScrollReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-green-500 mb-4">
              • instant pricing
            </p>
            <h2 className="font-display font-normal text-[32px] sm:text-[42px] text-ink mb-3 leading-tight tracking-[-0.01em]">
              Get your instant price.
            </h2>
            <p className="text-[16px] font-light text-ink-muted mb-12">
              No obligation — book online or get a quote sent to your inbox.
            </p>
          </ScrollReveal>
          <PriceForm />
        </div>
      </div>

      {/* ── FAQ ── */}
      <div id="faq">
        <FAQ />
      </div>
    </>
  )
}
