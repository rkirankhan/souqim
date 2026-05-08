import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Heart, Shield, MapPin, Paintbrush, Sparkles, ArrowRight } from 'lucide-react'

const beliefs = [
  {
    icon: Shield,
    title: 'Free should mean free.',
    body: 'Basic listings are free forever. No featured tiers gatekeeping discovery. No pay-to-be-found.',
  },
  {
    icon: MapPin,
    title: 'Local is worth protecting.',
    body: 'The businesses holding neighbourhoods together — the independent café, the one-woman florist, the careful joiner — deserve to be found by the people living ten minutes away.',
  },
  {
    icon: Heart,
    title: 'Women-led, visible.',
    body: 'A clear badge, a dedicated filter, and a platform designed with women in the room. Not a separate pink corner of the internet. A directory where women-led businesses are found alongside everyone else, and harder to miss.',
  },
  {
    icon: Paintbrush,
    title: 'Design matters here.',
    body: 'How a platform feels shapes who feels welcome on it. Warm over corporate. Plain language over jargon. A listing flow that respects a small business owner’s time.',
  },
]

const founderCompanies = [
  'Scale AI',
  'American Express',
  'Mapp Digital',
  'McCann Worldgroup',
  'Toptal',
  'Momentum',
  'Verizon',
  'SAP',
  'McKinsey',
]

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 md:pt-24 pb-12 md:pb-16" style={{ backgroundColor: '#FEF3E8' }}>
        <div aria-hidden className="absolute -top-32 -right-20 w-[440px] h-[440px] rounded-full blur-3xl" style={{ backgroundColor: '#C2410C', opacity: 0.12 }} />
        <div aria-hidden className="absolute -bottom-24 -left-12 w-[360px] h-[360px] rounded-full blur-3xl" style={{ backgroundColor: '#F59E0B', opacity: 0.18 }} />
        <div aria-hidden className="absolute inset-0" style={{ backgroundColor: 'rgba(254,243,232,0.35)' }} />

        <div className="container max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber text-amber-foreground rounded-full px-3.5 py-1.5 text-xs font-medium mb-6">
            <Sparkles className="size-3" />
            Our story
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-[58px] font-medium tracking-tight mb-6"
            style={{ fontFamily: '"DM Serif Display", serif', lineHeight: 1.06, letterSpacing: '-0.02em' }}
          >
            A directory built for the{' '}
            <em className="text-primary not-italic" style={{ fontStyle: 'italic' }}>
              businesses we love
            </em>
            .
          </h1>
          <p className="text-base md:text-lg text-[color:#5C4E46] leading-[1.65] max-w-2xl mx-auto">
            We&rsquo;re building the local directory small businesses actually
            deserve &mdash; free, fair, and designed with care.
          </p>
        </div>
      </section>

      {/* Why we exist — pull-quote callout */}
      <section className="px-4 py-16 md:py-24">
        <div className="container max-w-3xl mx-auto text-center space-y-6">
          <p className="text-2xl md:text-3xl font-medium leading-snug" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Most directories are built for advertisers. Listings get buried
            under paid placements.
          </p>
          <div>
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3.5 py-1.5 text-xs md:text-sm font-medium">
              <Sparkles className="size-3" />
              Listmio is built differently
            </span>
          </div>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We&rsquo;re a directory for small, independent businesses &mdash;
            free to list, free to find, designed with the people actually using
            it in mind. We give pride of place to women-led businesses through
            a clear badge and a dedicated filter, because visibility
            shouldn&rsquo;t depend on who already has a network.
          </p>
        </div>
      </section>

      {/* What we believe */}
      <section className="px-4 py-16 md:py-24" style={{ backgroundColor: '#FAF6F1' }}>
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-3">
              What we believe
            </p>
            <h2
              className="text-3xl md:text-4xl font-medium tracking-tight"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              Four principles, no fine print.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {beliefs.map((b, i) => {
              const Icon = b.icon
              return (
                <div
                  key={b.title}
                  className="group bg-card border border-border rounded-2xl p-7 md:p-8 transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/15">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <span
                      className="text-3xl font-medium text-primary/30 leading-none tabular-nums"
                      style={{ fontFamily: '"DM Serif Display", serif' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3
                    className="text-lg md:text-xl font-medium mb-2"
                    style={{ fontFamily: '"DM Serif Display", serif' }}
                  >
                    {b.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-[15px]">
                    {b.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About the founder */}
      <section className="px-4 py-16 md:py-24">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-3">
              Behind Listmio
            </p>
            <h2
              className="text-3xl md:text-4xl font-medium tracking-tight"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              About the founder
            </h2>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 max-w-3xl mx-auto shadow-sm">
            <p
              className="text-xl md:text-[26px] font-medium leading-snug mb-7"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              &ldquo;Visibility shouldn&rsquo;t depend on who already has a
              network.&rdquo;
            </p>

            <div className="space-y-4 text-foreground leading-7 text-[15px] md:text-base">
              <p>
                Listmio is founded by{' '}
                <a
                  href="https://www.linkedin.com/in/rkirankhan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline underline-offset-2"
                >
                  R. Kir&aacute;n Khan
                </a>
                , a lead product design engineer with over 15 years of
                experience building and launching digital platforms and SaaS
                products for global companies; Scale AI, McKinsey, Momentum,
                Mapp Digital, American Express and many more.
              </p>
              <p>
                She created Listmio after noticing how many thoughtful,
                independently run businesses in her community struggled to be
                discovered &mdash; not due to a lack of quality, but because
                existing platforms weren&rsquo;t designed with them in mind.
                Within this already crowded landscape, women-led businesses
                often faced an additional layer of invisibility.
              </p>
              <p>
                Listmio is her response to that gap: a directory built around
                the needs of those listing on it, with a focus on giving
                women-led ventures the visibility they deserve.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-3">
                Worked for global companies
              </p>
              <div className="flex flex-wrap gap-2">
                {founderCompanies.map((c) => (
                  <span
                    key={c}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-foreground/80"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 md:pb-24">
        <div className="container max-w-5xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-24 text-center"
            style={{ background: 'linear-gradient(135deg, #FEF3E8 0%, #FDE7CE 100%)' }}
          >
            <div
              aria-hidden
              className="absolute -top-24 -left-20 w-[440px] h-[440px] rounded-full pointer-events-none"
              style={{ backgroundColor: '#C2410C', opacity: 0.16, filter: 'blur(110px)' }}
            />
            <div
              aria-hidden
              className="absolute -bottom-20 -right-12 w-[380px] h-[380px] rounded-full pointer-events-none"
              style={{ backgroundColor: '#0F766E', opacity: 0.10, filter: 'blur(100px)' }}
            />
            <div
              aria-hidden
              className="absolute top-1/4 right-1/4 w-[320px] h-[320px] rounded-full pointer-events-none"
              style={{ backgroundColor: '#F59E0B', opacity: 0.10, filter: 'blur(90px)' }}
            />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-amber text-amber-foreground rounded-full px-3.5 py-1.5 text-xs font-medium mb-7">
                <Sparkles className="size-3" />
                Free forever for small businesses
              </span>
              <h2
                className="text-3xl md:text-[44px] font-medium text-foreground mb-4"
                style={{
                  fontFamily: '"DM Serif Display", serif',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.08,
                }}
              >
                List your business.{' '}
                <em
                  className="text-primary not-italic"
                  style={{ fontStyle: 'italic' }}
                >
                  Be found.
                </em>
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-[color:#5C4E46] mb-9 max-w-[480px] mx-auto">
                Built for the small UK businesses powering their communities forward — not the corporate masses.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="rounded-full px-7">
                  <Link to="/list">
                    Get started
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                  <Link to="/browse">Explore listings</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
