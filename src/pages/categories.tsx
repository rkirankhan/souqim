import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_ILLUSTRATIONS, DEFAULT_CATEGORY_ICON } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'

export function CategoriesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')
  const [missingIllustrations, setMissingIllustrations] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('businesses')
        .select('categories')
        .eq('status', 'live')
      if (cancelled) return
      const next: Record<string, number> = {}
      for (const row of data || []) {
        for (const cat of (row.categories as string[] | null) || []) {
          next[cat] = (next[cat] || 0) + 1
        }
      }
      setCounts(next)
    })()
    return () => { cancelled = true }
  }, [])

  const totalListings = Object.values(counts).reduce((s, n) => s + n, 0)
  const totalCategories = CATEGORIES.length
  const q = search.trim().toLowerCase()
  const filtered = q
    ? CATEGORIES.filter((c) => c.toLowerCase().includes(q))
    : CATEGORIES

  const markMissing = (category: string) =>
    setMissingIllustrations((prev) => {
      const next = new Set(prev)
      next.add(category)
      return next
    })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-12 md:pt-16 pb-12 md:pb-14" style={{ backgroundColor: '#FEF3E8' }}>
        <div aria-hidden className="absolute -top-24 -left-12 w-[440px] h-[440px] rounded-full blur-3xl" style={{ backgroundColor: '#C2410C', opacity: 0.14 }} />
        <div aria-hidden className="absolute -bottom-20 -right-12 w-[360px] h-[360px] rounded-full blur-3xl" style={{ backgroundColor: '#F59E0B', opacity: 0.18 }} />

        <div className="container max-w-3xl mx-auto text-center relative z-10">
          <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-3">
            {totalCategories} categories &middot; {totalListings || 0} live listings
          </p>
          <h1
            className="text-4xl md:text-[52px] font-medium tracking-tight mb-4"
            style={{ fontFamily: 'Fraunces, serif', lineHeight: 1.06, letterSpacing: '-0.02em' }}
          >
            Browse by{' '}
            <em className="text-primary not-italic" style={{ fontStyle: 'italic' }}>
              category
            </em>
          </h1>
          <p className="text-base md:text-lg text-[color:#5C4E46] mb-7 max-w-xl mx-auto leading-relaxed">
            Discover small, independent businesses &mdash; from food and coffee to tech, design and beyond.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="pl-11 h-12 rounded-full bg-card shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Glass-effect circle row */}
      {(() => {
        const withIllustration = CATEGORIES.filter(
          (c) => CATEGORY_ILLUSTRATIONS[c] && !missingIllustrations.has(c),
        )
        if (withIllustration.length === 0) return null
        return (
          <section className="px-4 py-8 md:py-10">
            <div className="container max-w-6xl mx-auto">
              <div
                className="flex gap-5 md:gap-7 overflow-x-auto pb-2 -mb-2 scrollbar-thin px-1"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to right, black 0%, black calc(100% - 32px), transparent 100%)',
                  maskImage:
                    'linear-gradient(to right, black 0%, black calc(100% - 32px), transparent 100%)',
                }}
              >
                {withIllustration.map((category) => (
                  <Link
                    key={category}
                    to={`/browse?category=${encodeURIComponent(category)}`}
                    className="group flex-shrink-0 flex flex-col items-center gap-2 w-[88px]"
                    title={category}
                  >
                    <img
                      src={CATEGORY_ILLUSTRATIONS[category]}
                      alt={category}
                      className="size-[80px] md:size-[96px] object-contain select-none transition-transform group-hover:scale-[1.06]"
                      loading="lazy"
                      onError={() => markMissing(category)}
                    />
                    <span className="text-[11px] md:text-xs font-medium text-foreground/80 text-center leading-tight line-clamp-2">
                      {category}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* All categories grid */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: '#FAF6F1' }}>
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-2">
                All categories
              </p>
              <h2
                className="text-2xl md:text-3xl font-medium tracking-tight"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                {q ? 'Search results' : 'Find your people'}
              </h2>
            </div>
            <Link
              to="/browse"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-2 whitespace-nowrap"
            >
              Browse all listings
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filtered.map((category) => {
                const Icon = CATEGORY_ICONS[category] || DEFAULT_CATEGORY_ICON
                const illustration = CATEGORY_ILLUSTRATIONS[category]
                const showIllustration = illustration && !missingIllustrations.has(category)
                const count = counts[category] || 0
                const countLabel =
                  count === 0
                    ? 'No listings yet'
                    : count === 1
                      ? '1 business'
                      : `${count} businesses`
                return (
                  <Link
                    key={category}
                    to={`/browse?category=${encodeURIComponent(category)}`}
                    className="group relative rounded-2xl border border-border bg-card p-4 md:p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
                  >
                    {showIllustration ? (
                      <img
                        src={illustration}
                        alt=""
                        className="size-14 md:size-16 object-contain select-none mb-3 transition-transform group-hover:scale-[1.06]"
                        loading="lazy"
                        onError={() => markMissing(category)}
                      />
                    ) : (
                      <div className="size-14 md:size-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 transition-colors group-hover:bg-primary/15">
                        <Icon className="size-6 text-primary" />
                      </div>
                    )}
                    <h3 className="text-[15px] md:text-base font-medium leading-tight mb-1 group-hover:text-primary transition-colors">
                      {category}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{countLabel}</p>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No categories match &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-14 md:py-20" style={{ backgroundColor: '#FEF3E8' }}>
        <div className="container max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl font-medium mb-3"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Don&rsquo;t see your trade?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We&rsquo;re still adding categories. List your business now and we&rsquo;ll find the right home for it.
          </p>
          <Link
            to="/list"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            List your business &mdash; it&rsquo;s free
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
