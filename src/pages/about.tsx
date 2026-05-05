import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Heart, Shield, MapPin, Paintbrush } from 'lucide-react'

const beliefs = [
  {
    icon: Shield,
    title: 'Free should mean free.',
    body: 'Basic listings are free forever. No featured tiers gatekeeping discovery. No pay-to-be-found.',
  },
  {
    icon: MapPin,
    title: 'Local is worth protecting.',
    body: 'The businesses holding neighbourhoods together \u2014 the independent caf\u00e9, the one-woman florist, the careful joiner \u2014 deserve to be found by the people living ten minutes away.',
  },
  {
    icon: Heart,
    title: 'Women-led, visible.',
    body: 'A clear badge, a dedicated filter, and a platform designed with women in the room. Not a separate pink corner of the internet. A directory where women-led businesses are found alongside everyone else, and harder to miss.',
  },
  {
    icon: Paintbrush,
    title: 'Design matters here.',
    body: 'How a platform feels shapes who feels welcome on it. Warm over corporate. Plain language over jargon. A listing flow that respects a small business owner\u2019s time.',
  },
]

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 md:py-28 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            About ListMio
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We&rsquo;re building the local directory small businesses actually
            deserve
          </p>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="bg-card border-y border-border px-4 py-16 md:py-20">
        <div className="container max-w-2xl mx-auto space-y-6 text-foreground leading-7">
          <p>
            Most directories are built for advertisers. Listings get buried
            under paid placements. Sign-up flows assume you have a marketing
            team. The design rewards whoever spends the most, not whoever does
            the best work.
          </p>
          <p
            className="text-xl md:text-2xl font-medium"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Listmio is built differently.
          </p>
          <p>
            We&rsquo;re a directory for small, independent businesses &mdash;
            free to list, free to find, designed with the people actually using
            it in mind. We give pride of place to women-led businesses through
            a clear badge and a dedicated filter, because visibility
            shouldn&rsquo;t depend on who already has a network.
          </p>
        </div>
      </section>

      {/* What we believe */}
      <section className="px-4 py-16 md:py-24">
        <div className="container max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-medium text-center mb-14"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            What we believe
          </h2>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {beliefs.map((b) => {
              const Icon = b.icon
              return (
                <div
                  key={b.title}
                  className="bg-card border border-border rounded-xl p-6 md:p-8"
                >
                  <div className="rounded-lg bg-primary/10 p-2.5 w-fit mb-4">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {b.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {b.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About the founder */}
      <section className="bg-card border-y border-border px-4 py-16 md:py-20">
        <div className="container max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-medium mb-10"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            About the founder
          </h2>

          <div className="space-y-6 text-foreground leading-7">
            <p>
              ListMio is founded by{' '}
              <a
                href="https://www.linkedin.com/in/rkirankhan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline underline-offset-2"
              >
                R. Kir&aacute;n Khan
              </a>
              , a lead product design engineer with over 15 years of experience
              building and launching digital platforms and SaaS products. Her
              background includes work with companies such as American Express,
              Mapp Digital, McCann Worldgroup, Verizon, SAP, and recently with
              McKinsey.
            </p>
            <p>
              She created ListMio after noticing how many thoughtful,
              independently run businesses in her community struggled to be
              discovered &mdash; not due to a lack of quality, but because
              existing platforms weren&rsquo;t designed with them in mind.
              Within this already crowded landscape, women-led businesses often
              faced an additional layer of invisibility.
            </p>
            <p>
              ListMio is her response to that gap: a directory built around the
              needs of those listing on it, with a focus on giving women-led
              ventures the visibility they deserve.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 md:py-24">
        <div className="container max-w-xl mx-auto text-center space-y-5">
          <h2
            className="text-3xl md:text-4xl font-medium"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            List your business
          </h2>
          <p className="text-muted-foreground text-lg">
            Free to list. Built for businesses like yours.
          </p>
          <Button size="lg" asChild>
            <Link to="/list">Get started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
