import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Rocket } from 'lucide-react'
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_ILLUSTRATIONS, DEFAULT_CATEGORY_ICON } from '@/lib/constants'
import { supabase } from '@/lib/supabase'

export function CategoriesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [missingIllustrations, setMissingIllustrations] = useState<Set<string>>(new Set())
  const [collectionCounts, setCollectionCounts] = useState<{ womenLed: number; startup: number }>({ womenLed: 0, startup: 0 })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('businesses')
        .select('categories,is_women_owned,is_startup')
        .eq('status', 'live')
      if (cancelled) return
      const next: Record<string, number> = {}
      let women = 0
      let startup = 0
      for (const row of (data || []) as { categories: string[] | null; is_women_owned?: boolean; is_startup?: boolean }[]) {
        for (const cat of row.categories || []) {
          next[cat] = (next[cat] || 0) + 1
        }
        if (row.is_women_owned) women += 1
        if (row.is_startup) startup += 1
      }
      setCounts(next)
      setCollectionCounts({ womenLed: women, startup })
    })()
    return () => { cancelled = true }
  }, [])

  const totalListings = Object.values(counts).reduce((s, n) => s + n, 0)
  const totalCategories = CATEGORIES.length
  const filtered = CATEGORIES

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
          <p className="text-base md:text-lg text-[color:#5C4E46] max-w-xl mx-auto leading-relaxed">
            Discover small, independent businesses &mdash; from food and coffee to tech, design and beyond.
          </p>
        </div>
      </section>


      {/* Collections — curated cross-cutting filters */}
      {(collectionCounts.womenLed > 0 || collectionCounts.startup > 0) && (
        <section className="py-10 md:py-12 px-4 border-b" style={{ backgroundColor: '#FAF6F1' }}>
          <div className="container max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.10em] uppercase text-[#9D8E87] mb-2">
              Collections
            </p>
            <h2
              className="text-2xl md:text-3xl font-medium tracking-tight mb-6"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              Discover by spirit
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {collectionCounts.womenLed > 0 && (
                <Link
                  to="/browse?women-led=true"
                  className="group relative rounded-2xl border border-amber/40 p-6 md:p-7 transition-all hover:-translate-y-1 hover:border-amber/70"
                  style={{ background: 'linear-gradient(135deg, #FEF3E8 0%, #FDE7CE 100%)' }}
                >
                  <div className="size-14 rounded-full bg-amber text-amber-foreground flex items-center justify-center mb-4">
                    <Sparkles className="size-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium mb-1.5" style={{ fontFamily: 'Fraunces, serif' }}>
                    Women-led businesses
                  </h3>
                  <p className="text-sm text-[color:#5C4E46]">
                    {collectionCounts.womenLed} {collectionCounts.womenLed === 1 ? 'business' : 'businesses'} championed by women
                  </p>
                </Link>
              )}
              {collectionCounts.startup > 0 && (
                <Link
                  to="/browse?startup=true"
                  className="group relative rounded-2xl border border-indigo-200 p-6 md:p-7 transition-all hover:-translate-y-1 hover:border-indigo-400"
                  style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)' }}
                >
                  <div className="size-14 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-4">
                    <Rocket className="size-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium mb-1.5" style={{ fontFamily: 'Fraunces, serif' }}>
                    Startups
                  </h3>
                  <p className="text-sm text-[color:#5C4E46]">
                    {collectionCounts.startup} emerging {collectionCounts.startup === 1 ? 'business' : 'businesses'} on the rise
                  </p>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

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
                Find your people
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                    className="group relative rounded-2xl border border-border bg-card p-6 md:p-8 transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
                  >
                    {showIllustration ? (
                      <img
                        src={illustration}
                        alt=""
                        className="size-20 md:size-24 object-contain select-none mb-4 transition-transform group-hover:scale-[1.06]"
                        loading="lazy"
                        onError={() => markMissing(category)}
                      />
                    ) : (
                      <div className="size-20 md:size-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/15">
                        <Icon className="size-9 text-primary" />
                      </div>
                    )}
                    <h3 className="text-lg md:text-xl font-medium leading-tight mb-1.5 group-hover:text-primary transition-colors" style={{ fontFamily: 'Fraunces, serif' }}>
                      {category}
                    </h3>
                    <p className="text-sm md:text-[15px] text-muted-foreground">{countLabel}</p>
                  </Link>
                )
              })}
          </div>
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
