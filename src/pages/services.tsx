import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import {
  Sparkles, Rocket, Globe, Share2, Paintbrush, Hop as Home,
  ArrowRight, Check, MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { ServiceInquiryInsert } from '@/lib/database.types'

type ServiceKey = 'website' | 'social' | 'listing' | 'brand'
type StageKey = 'women-led' | 'startup' | 'home-based' | 'established'

const SERVICES: {
  key: ServiceKey
  title: string
  pitch: string
  Icon: typeof Globe
  iconBg: string
  iconColor: string
  fromPrice: number
  specialPrice: number
  bullets: string[]
}[] = [
  {
    key: 'website',
    title: 'Simple startup website',
    pitch: 'A clean, fast 1–5 page site you can launch in weeks, not months.',
    Icon: Globe,
    iconBg: '#FEF0E7',
    iconColor: '#C2410C',
    fromPrice: 499,
    specialPrice: 349,
    bullets: [
      'Up to 5 pages, mobile-first design',
      'Custom domain set-up + hosting guidance',
      'Contact form, simple SEO basics',
      'One round of revisions included',
    ],
  },
  {
    key: 'social',
    title: 'Social media starter pack',
    pitch: 'Show up on the platforms that matter — without the overwhelm.',
    Icon: Share2,
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    fromPrice: 249,
    specialPrice: 179,
    bullets: [
      'Profile setup on Instagram, TikTok or Facebook',
      '4 weeks of starter posts (designed for you)',
      'Simple monthly content calendar',
      'A 30-min handover so you can carry on',
    ],
  },
  {
    key: 'listing',
    title: 'Listing optimization',
    pitch: 'Make your ListMio page actually convert browsers into customers.',
    Icon: Sparkles,
    iconBg: '#FEF3E8',
    iconColor: '#D97706',
    fromPrice: 99,
    specialPrice: 69,
    bullets: [
      'Photo selection + light editing',
      'Re-written description and tagline',
      'Services list with pricing guidance',
      'Opening hours and contact polish',
    ],
  },
  {
    key: 'brand',
    title: 'Brand starter (logo + colours)',
    pitch: 'A simple, considered identity to make you look like a real business.',
    Icon: Paintbrush,
    iconBg: '#ECFDF5',
    iconColor: '#047857',
    fromPrice: 199,
    specialPrice: 149,
    bullets: [
      'Wordmark or simple logo',
      'A 3–4 colour palette',
      '1-page style guide PDF',
      'Files for web + print',
    ],
  },
]

const STAGES: { key: StageKey; label: string; Icon: typeof Sparkles }[] = [
  { key: 'women-led', label: 'Women-led', Icon: Sparkles },
  { key: 'startup', label: 'Startup', Icon: Rocket },
  { key: 'home-based', label: 'Home-based', Icon: Home },
  { key: 'established', label: 'Established', Icon: Check },
]

const inquirySchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  business_name: z.string().optional(),
  brief: z.string().optional(),
})

type InquiryForm = z.infer<typeof inquirySchema>

export function ServicesPage() {
  const [submitting, setSubmitting] = useState(false)
  const [stages, setStages] = useState<StageKey[]>([])
  const [services, setServices] = useState<ServiceKey[]>([])

  const form = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', phone: '', business_name: '', brief: '' },
  })

  const specialEligible = stages.includes('women-led') || stages.includes('startup')

  function toggleStage(key: StageKey) {
    setStages((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    )
  }

  function toggleService(key: ServiceKey) {
    setServices((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    )
  }

  function pickServiceAndScroll(key: ServiceKey) {
    setServices((prev) => (prev.includes(key) ? prev : [...prev, key]))
    requestAnimationFrame(() => {
      document.getElementById('request')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  async function onSubmit(data: InquiryForm) {
    setSubmitting(true)
    try {
      const payload: ServiceInquiryInsert = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        business_name: data.business_name?.trim() || null,
        business_stage: stages,
        services_interested: services,
        brief: data.brief?.trim() || null,
      }
      const { error } = await supabase.from('service_inquiries').insert(payload as any)
      if (error) throw error
      toast.success("Thanks — we'll be in touch within 1 working day.")
      form.reset()
      setStages([])
      setServices([])
    } catch (err: any) {
      console.error('Service inquiry submit error:', err)
      toast.error(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 pt-12 md:pt-16 pb-12 md:pb-14"
        style={{ backgroundColor: '#FEF3E8' }}
      >
        <div aria-hidden className="absolute -top-24 -left-12 w-[440px] h-[440px] rounded-full blur-3xl" style={{ backgroundColor: '#C2410C', opacity: 0.14 }} />
        <div aria-hidden className="absolute -bottom-20 -right-12 w-[360px] h-[360px] rounded-full blur-3xl" style={{ backgroundColor: '#F59E0B', opacity: 0.18 }} />

        <div className="container max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-amber text-amber-foreground rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide mb-5">
            <Sparkles className="size-3.5" />
            Built alongside you
          </span>
          <h1
            className="text-4xl md:text-[52px] font-medium tracking-tight mb-4"
            style={{ fontFamily: 'Fraunces, serif', lineHeight: 1.06, letterSpacing: '-0.02em' }}
          >
            Grow your business with{' '}
            <em className="text-primary not-italic" style={{ fontStyle: 'italic' }}>
              a partner
            </em>{' '}
            who gets it
          </h1>
          <p className="text-base md:text-lg text-[color:#5C4E46] max-w-xl mx-auto leading-relaxed mb-7">
            From a first website to your first Instagram post, we work shoulder-to-shoulder with small UK businesses — at a price that makes sense.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="rounded-full h-11 px-5">
              <a href="#services">
                See services
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-full h-11 px-5">
              <a href="#request">Request a quote</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Discount strip */}
      <section className="px-4 py-6 border-b" style={{ background: 'linear-gradient(90deg, #EEF2FF 0%, #FEF3E8 100%)' }}>
        <div className="container max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="size-9 rounded-full bg-amber text-amber-foreground flex items-center justify-center">
              <Sparkles className="size-4" />
            </span>
            <span className="size-9 rounded-full bg-indigo-600 text-white flex items-center justify-center -ml-2 ring-2 ring-card">
              <Rocket className="size-4" />
            </span>
          </div>
          <p className="text-sm md:text-[15px] text-[color:#5C4E46] max-w-2xl">
            <span className="font-semibold text-foreground">Women-led businesses and startups</span> get a special rate on every service — usually around <span className="font-semibold text-primary">30% off</span>.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section id="services" className="py-12 md:py-16 px-4" style={{ backgroundColor: '#FAF6F1' }}>
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-9 md:mb-12">
            <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-2">
              Services
            </p>
            <h2
              className="text-2xl md:text-3xl font-medium tracking-tight"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              Pick the help you need
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.key}
                className="rounded-2xl border border-border bg-card p-6 md:p-8 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md flex flex-col"
              >
                <div
                  className="size-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: s.iconBg }}
                >
                  <s.Icon className="size-5" style={{ color: s.iconColor }} />
                </div>
                <h3
                  className="text-xl font-medium mb-2"
                  style={{ fontFamily: 'Fraunces, serif' }}
                >
                  {s.title}
                </h3>
                <p className="text-sm text-[color:#5C4E46] leading-relaxed mb-4">
                  {s.pitch}
                </p>
                <ul className="space-y-2 mb-6">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-[color:#5C4E46]">
                      <Check className="size-4 mt-0.5 shrink-0" style={{ color: s.iconColor }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-5 border-t border-border">
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <span className="text-sm text-muted-foreground">From</span>
                    <span
                      className="text-2xl font-medium tabular-nums"
                      style={{ fontFamily: 'Fraunces, serif' }}
                    >
                      £{s.fromPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                      <Sparkles className="size-3" />
                      Women-led / startup
                    </span>
                    <span className="text-[15px] font-medium text-primary tabular-nums">
                      from £{s.specialPrice}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => pickServiceAndScroll(s.key)}
                    className="w-full rounded-full h-10"
                  >
                    Request this
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: '#FEF3E8' }}>
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-9 md:mb-12">
            <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-2">
              How it works
            </p>
            <h2
              className="text-2xl md:text-3xl font-medium tracking-tight"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              A no-surprises partnership
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {[
              { n: '01', title: 'Tell us what you need', body: 'Use the form below — even a rough brief is fine. We reply within one working day.' },
              { n: '02', title: 'We scope it together', body: 'A short call to agree on what we deliver, by when, for a fixed price. No surprises.' },
              { n: '03', title: 'We build, you launch', body: 'Most projects ship in 1–3 weeks. You own everything we make for you.' },
            ].map((step) => (
              <div key={step.n} className="rounded-2xl border border-border bg-card p-6 md:p-7">
                <span className="inline-block text-xs font-semibold tracking-[0.10em] text-primary mb-3">
                  {step.n}
                </span>
                <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
                  {step.title}
                </h3>
                <p className="text-sm text-[color:#5C4E46] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ListMio */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: '#FAF6F1' }}>
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-9 md:mb-12">
            <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-2">
              Why us
            </p>
            <h2
              className="text-2xl md:text-3xl font-medium tracking-tight"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              Made for small UK businesses
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {[
              { title: 'UK-based', body: 'A small team, working UK hours, in plain English. No outsourced surprises.' },
              { title: 'Small businesses only', body: "We don't take on enterprise work. We get what running a one-or-two-person business is like." },
              { title: 'Transparent pricing', body: 'Fixed prices, written down before we start. Special rates for women-led businesses and startups.' },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-card p-6 md:p-7 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
                  {b.title}
                </h3>
                <p className="text-sm text-[color:#5C4E46] leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote request form */}
      <section id="request" className="py-12 md:py-16 px-4" style={{ backgroundColor: '#FEF3E8' }}>
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-2">
              Request a quote
            </p>
            <h2
              className="text-2xl md:text-3xl font-medium tracking-tight mb-3"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              Tell us what you need
            </h2>
            <p className="text-sm md:text-base text-[color:#5C4E46]">
              Takes about a minute. We'll reply within one working day.
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">Your name *</Label>
                <Input id="name" placeholder="Jane Doe" className="h-11" {...form.register('name')} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="h-11" {...form.register('email')} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input id="phone" type="tel" className="h-11" {...form.register('phone')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="business_name" className="text-sm font-medium">
                  Business name <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input id="business_name" className="h-11" {...form.register('business_name')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Your business is…</Label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => {
                  const active = stages.includes(s.key)
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => toggleStage(s.key)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border text-foreground hover:border-primary/40'
                      }`}
                    >
                      <s.Icon className="size-3.5" />
                      {s.label}
                    </button>
                  )
                })}
              </div>
              {specialEligible && (
                <p className="text-xs text-indigo-700 inline-flex items-center gap-1 mt-1">
                  <Sparkles className="size-3" />
                  You're eligible for our special rate.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Services you're interested in</Label>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => {
                  const active = services.includes(s.key)
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => toggleService(s.key)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border text-foreground hover:border-primary/40'
                      }`}
                    >
                      <s.Icon className="size-3.5" />
                      {s.title}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brief" className="text-sm font-medium">
                A short brief <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="brief"
                rows={4}
                placeholder="What do you have so far, and what would success look like?"
                {...form.register('brief')}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full h-11"
            >
              {submitting ? <Spinner className="size-4" /> : 'Send my request'}
            </Button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: '#FAF6F1' }}>
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-2">
              FAQ
            </p>
            <h2
              className="text-2xl md:text-3xl font-medium tracking-tight"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              Good to know
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {[
              { q: "How long does a project take?", a: "Most listings take a few days; social starter packs run 2 weeks; websites usually land in 2–4 weeks. We'll agree the timeline up-front." },
              { q: "Who owns the website / brand assets?", a: "You do. Once it's paid for, everything we make is yours — files, accounts, domain, the lot." },
              { q: "How does payment work?", a: "50% to start, 50% on launch. Bank transfer or card. Listing optimization is paid in full up-front." },
              { q: "What happens after launch?", a: "We hand over a short walkthrough so you can run things yourself. Need help later? You can always book a top-up — we're not going anywhere." },
            ].map((item) => (
              <details key={item.q} className="group p-5 md:p-6">
                <summary className="flex items-start justify-between gap-3 cursor-pointer list-none">
                  <h3 className="text-base font-medium pr-4" style={{ fontFamily: 'Fraunces, serif' }}>
                    {item.q}
                  </h3>
                  <span className="shrink-0 size-7 rounded-full bg-muted/60 flex items-center justify-center transition-transform group-open:rotate-45">
                    <span className="text-base text-foreground/80 leading-none">+</span>
                  </span>
                </summary>
                <p className="text-sm text-[color:#5C4E46] leading-relaxed mt-3">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-14 md:py-20" style={{ background: 'linear-gradient(135deg, #C2410C 0%, #AE4024 60%, #8A2D14 100%)' }}>
        <div className="container max-w-3xl mx-auto text-center text-white">
          <h2
            className="text-2xl md:text-3xl font-medium tracking-tight mb-3"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Not sure what you need? Just say hi.
          </h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            A 15-minute chat is often enough to figure out the right move. No pressure, no contract.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="secondary" className="rounded-full h-11 px-5 bg-white text-primary hover:bg-white/95">
              <a href="#request">Request a quote</a>
            </Button>
            <Button asChild variant="outline" className="rounded-full h-11 px-5 bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white">
              <Link to="/contact">
                <MessageCircle className="size-4" />
                Or send a message
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
