import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { CATEGORIES, CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'

export function CategoriesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')

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
  const q = search.trim().toLowerCase()
  const filtered = q
    ? CATEGORIES.filter((c) => c.toLowerCase().includes(q))
    : CATEGORIES

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border py-14 md:py-20 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-medium tracking-tight mb-4"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Browse by category
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            {totalListings > 0
              ? `Discover local businesses across ${totalListings} live listings — from food and coffee to tech, design and beyond.`
              : 'Discover local businesses across food, coffee, tech, design and beyond.'}
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

      <section className="py-12 md:py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filtered.map((category) => {
                const Icon = CATEGORY_ICONS[category] || DEFAULT_CATEGORY_ICON
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
                    className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="rounded-xl bg-primary/10 p-3 w-fit mb-3 group-hover:bg-primary/15 transition-colors">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <h3 className="text-base font-medium leading-tight mb-1">
                      {category}
                    </h3>
                    <p className="text-sm text-muted-foreground">{countLabel}</p>
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
    </div>
  )
}
