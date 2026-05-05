import { Link } from 'react-router-dom'
import { Mail, MessageSquare, Sparkles, ArrowRight } from 'lucide-react'

export function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-12 md:pt-16 pb-12" style={{ backgroundColor: '#FEF3E8' }}>
        <div aria-hidden className="absolute -top-24 -left-12 w-[440px] h-[440px] rounded-full blur-3xl" style={{ backgroundColor: '#C2410C', opacity: 0.14 }} />
        <div aria-hidden className="absolute -bottom-20 -right-12 w-[360px] h-[360px] rounded-full blur-3xl" style={{ backgroundColor: '#F59E0B', opacity: 0.18 }} />

        <div className="container max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber text-amber-foreground rounded-full px-3.5 py-1.5 text-xs font-medium mb-6">
            <Sparkles className="size-3" />
            Get in touch
          </div>
          <h1
            className="text-4xl md:text-[52px] font-medium tracking-tight mb-4"
            style={{ fontFamily: 'Fraunces, serif', lineHeight: 1.06, letterSpacing: '-0.02em' }}
          >
            We&rsquo;d love to{' '}
            <em className="text-primary not-italic" style={{ fontStyle: 'italic' }}>
              hear from you
            </em>
            .
          </h1>
          <p className="text-base md:text-lg text-[color:#5C4E46] max-w-xl mx-auto leading-relaxed">
            Two simple ways to reach us &mdash; pick whichever fits your message.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="px-4 py-14 md:py-20">
        <div className="container max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            <a
              href="mailto:support@listmio.com"
              className="group block bg-card border border-border rounded-2xl p-7 md:p-8 transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="rounded-xl bg-primary/10 p-3 w-fit mb-5 transition-colors group-hover:bg-primary/15">
                <Mail className="size-6 text-primary" />
              </div>
              <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-2">
                Listing support
              </p>
              <h2
                className="text-xl md:text-2xl font-medium leading-snug mb-2"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                Email us
              </h2>
              <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-5">
                Anything about your listing &mdash; updates, edits, account
                issues, removing a listing, business verification.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:underline underline-offset-2">
                support@listmio.com
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>

            <a
              href="mailto:info@listmio.com"
              className="group block bg-card border border-border rounded-2xl p-7 md:p-8 transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="rounded-xl bg-amber/40 p-3 w-fit mb-5 transition-colors group-hover:bg-amber/55">
                <MessageSquare className="size-6 text-amber-foreground" />
              </div>
              <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-2">
                General inquiries
              </p>
              <h2
                className="text-xl md:text-2xl font-medium leading-snug mb-2"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                Say hi
              </h2>
              <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-5">
                Press, partnerships, feedback, ideas, or anything not directly
                tied to a specific listing.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:underline underline-offset-2">
                info@listmio.com
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>

          {/* FAQ pointer */}
          <div className="mt-10 md:mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Quick question? You may find the answer faster in our FAQ.
            </p>
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-2"
            >
              Browse FAQ
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
