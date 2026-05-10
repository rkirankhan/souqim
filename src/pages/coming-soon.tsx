import { Sparkles } from 'lucide-react'

export function ComingSoonPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(180deg, var(--cream) 0%, #FDE7CE 100%)' }}
    >
      {/* Hero blob motif */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ backgroundColor: 'var(--orange)', opacity: 0.16, filter: 'blur(110px)' }}
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -right-12 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ backgroundColor: 'var(--teal)', opacity: 0.10, filter: 'blur(100px)' }}
      />
      <div
        aria-hidden
        className="absolute top-1/3 left-1/2 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{ backgroundColor: '#F59E0B', opacity: 0.10, filter: 'blur(90px)' }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Wordmark */}
        <div
          className="text-[34px] md:text-[40px] text-primary mb-10 md:mb-14"
          style={{
            fontFamily: '"DM Serif Display", serif',
            letterSpacing: '-0.025em',
          }}
        >
          List<em className="italic">m</em>io
        </div>

        {/* Eyebrow */}
        <span
          className="inline-flex items-center gap-1.5 bg-amber text-amber-foreground rounded-full px-3.5 py-1.5 text-xs font-medium mb-7"
        >
          <Sparkles className="size-3" />
          Coming soon
        </span>

        {/* Headline */}
        <h1
          className="text-4xl md:text-[56px] font-medium text-foreground mb-6"
          style={{
            fontFamily: '"DM Serif Display", serif',
            letterSpacing: '-0.02em',
            lineHeight: 1.06,
          }}
        >
          Putting the{' '}
          <em
            className="text-primary not-italic"
            style={{ fontStyle: 'italic', marginRight: '0.04em' }}
          >
            finishing touches
          </em>{' '}
          on something warm.
        </h1>

        {/* Sub */}
        <p
          className="text-base md:text-lg max-w-md mx-auto leading-relaxed mb-10"
          style={{ color: 'var(--ink-sub)' }}
        >
          A UK community business directory built for small, independent
          businesses and the people who love them. Back online soon.
        </p>

        {/* Contact */}
        <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
          Questions in the meantime?{' '}
          <a
            href="mailto:info@listmio.com"
            className="text-primary font-medium hover:underline underline-offset-2"
          >
            info@listmio.com
          </a>
        </p>
      </div>
    </div>
  )
}
