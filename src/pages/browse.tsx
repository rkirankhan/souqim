import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, MapPin, Sparkles, Filter, X, Store, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BusinessCard } from '@/components/business-card'
import { supabase } from '@/lib/supabase'
import type { Business } from '@/lib/database.types'
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_ILLUSTRATIONS, DEFAULT_CATEGORY_ICON } from '@/lib/constants'

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchLocation, setSearchLocation] = useState(searchParams.get('location') || '')
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('keyword') || '')
  const [focusedField, setFocusedField] = useState<'kw' | 'loc' | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const selectedCategory = searchParams.get('category') || ''
  const womenLedOnly = searchParams.get('women-led') === 'true'
  const startupOnly = searchParams.get('startup') === 'true'

  useEffect(() => {
    loadBusinesses()
    loadCategoryCounts()
  }, [searchParams])

  async function loadBusinesses() {
    setLoading(true)
    try {
      let query = supabase.from('businesses').select('*')

      const keyword = searchParams.get('keyword')
      if (keyword) {
        query = query.or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`)
      }

      const location = searchParams.get('location')
      if (location) {
        query = query.or(`location.ilike.%${location}%,postcode.ilike.%${location}%`)
      }

      const category = searchParams.get('category')
      if (category && category !== 'all') {
        query = query.contains('categories', [category])
      }

      if (searchParams.get('women-led') === 'true') {
        query = query.eq('is_women_owned', true)
      }

      if (searchParams.get('startup') === 'true') {
        query = query.eq('is_startup', true)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error
      setBusinesses(data || [])
    } catch (error) {
      console.error('Error loading businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadCategoryCounts() {
    try {
      const { data } = await supabase.from('businesses').select('categories')
      if (!data) return
      const counts: Record<string, number> = {}
      for (const row of data as { categories: string[] | null }[]) {
        for (const c of row.categories ?? []) counts[c] = (counts[c] ?? 0) + 1
      }
      setCategoryCounts(counts)
      setTotalCount(data.length)
    } catch (err) {
      console.error('Error loading counts:', err)
    }
  }

  function updateParams(mutate: (p: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams)
    mutate(params)
    setSearchParams(params)
  }

  function handleSearch() {
    updateParams((p) => {
      if (searchKeyword) p.set('keyword', searchKeyword); else p.delete('keyword')
      if (searchLocation) p.set('location', searchLocation); else p.delete('location')
    })
  }

  function setCategory(name: string) {
    updateParams((p) => {
      if (!name || p.get('category') === name) p.delete('category')
      else p.set('category', name)
    })
  }

  function toggleWomenLed() {
    updateParams((p) => {
      if (p.get('women-led') === 'true') p.delete('women-led')
      else p.set('women-led', 'true')
    })
  }

  function toggleStartup() {
    updateParams((p) => {
      if (p.get('startup') === 'true') p.delete('startup')
      else p.set('startup', 'true')
    })
  }

  function clearAllFilters() {
    setSearchKeyword('')
    setSearchLocation('')
    setSearchParams({})
  }

  const activeFilters = [selectedCategory, womenLedOnly, startupOnly].filter(Boolean).length

  return (
    <div className="min-h-screen">
      {/* ── HEADER / SEARCH ── */}
      <section
        className="relative overflow-hidden border-b px-4 py-8 md:py-10"
        style={{ backgroundColor: '#FEF3E8' }}
      >
        <div aria-hidden className="absolute -top-32 -left-16 w-[440px] h-[440px] rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: '#C2410C', opacity: 0.10 }} />
        <div aria-hidden className="absolute -bottom-32 -right-16 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: '#F59E0B', opacity: 0.14 }} />

        <div className="container max-w-6xl mx-auto relative z-10">
          {/* Title */}
          <div className="text-center mb-6 md:mb-7">
            <h1
              className="text-2xl md:text-[36px] font-medium tracking-tight mb-1.5"
              style={{ fontFamily: 'Fraunces, serif', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Explore{' '}
              <em className="text-primary not-italic" style={{ fontStyle: 'italic' }}>
                local
              </em>{' '}
              businesses
            </h1>
            <p className="text-sm md:text-base text-[color:#5C4E46]">
              Search by name, place, or what they do.
            </p>
          </div>

          {/* Search bar */}
          <div
            className="flex flex-col sm:flex-row bg-card border rounded-[14px] p-1 max-w-[700px] mx-auto transition-all"
            style={{
              borderColor: focusedField ? '#C2410C' : '#E8E2DC',
              boxShadow: focusedField ? '0 0 0 3px #FEF0E7' : '0 2px 10px rgba(0,0,0,0.05)',
            }}
          >
            <div
              className="flex-[1.2] flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] cursor-text transition-colors"
              style={{ background: focusedField === 'kw' ? '#FAF6F1' : 'transparent' }}
              onClick={() => setFocusedField('kw')}
            >
              <Search className="size-[15px] shrink-0" style={{ color: focusedField === 'kw' ? '#C2410C' : '#9D8E87' }} />
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search businesses…"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-auto p-0 text-sm"
                onFocus={() => setFocusedField('kw')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSearchKeyword('')
                    updateParams((p) => p.delete('keyword'))
                  }}
                  className="p-1 rounded"
                  aria-label="Clear keyword"
                >
                  <X className="size-3 text-[#9D8E87]" />
                </button>
              )}
            </div>
            <div className="hidden sm:block w-px bg-border my-2" />
            <div
              className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] cursor-text transition-colors"
              style={{ background: focusedField === 'loc' ? '#FAF6F1' : 'transparent' }}
              onClick={() => setFocusedField('loc')}
            >
              <MapPin className="size-[15px] shrink-0" style={{ color: focusedField === 'loc' ? '#C2410C' : '#9D8E87' }} />
              <Input
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="City or postcode"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-auto p-0 text-sm"
                onFocus={() => setFocusedField('loc')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchLocation && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSearchLocation('')
                    updateParams((p) => p.delete('location'))
                  }}
                  className="p-1 rounded"
                  aria-label="Clear location"
                >
                  <X className="size-3 text-[#9D8E87]" />
                </button>
              )}
            </div>
            <Button onClick={handleSearch} className="rounded-[10px]">
              <Search className="size-[14px]" />
              <span className="sm:hidden md:inline">Search</span>
            </Button>
          </div>

          {/* Category quick-jump scroll row (below search) */}
          {(() => {
            const cats = CATEGORIES.filter((c) => CATEGORY_ILLUSTRATIONS[c])
            if (cats.length === 0) return null
            return (
              <div className="mt-7 md:mt-9">
                <p className="text-center text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9D8E87] mb-4">
                  Browse by category
                </p>
                <div
                  className="flex gap-4 md:gap-6 overflow-x-auto pb-2 -mb-2 scrollbar-thin md:justify-center"
                  style={{
                    WebkitMaskImage:
                      'linear-gradient(to right, black 0%, black calc(100% - 32px), transparent 100%)',
                    maskImage:
                      'linear-gradient(to right, black 0%, black calc(100% - 32px), transparent 100%)',
                  }}
                >
                  {cats.map((category) => {
                    const isActive = selectedCategory === category
                    return (
                      <Link
                        key={category}
                        to={`/browse?category=${encodeURIComponent(category)}`}
                        className={`group flex-shrink-0 flex flex-col items-center gap-1.5 w-[80px] transition-opacity ${
                          selectedCategory && !isActive ? 'opacity-60 hover:opacity-100' : ''
                        }`}
                        title={category}
                      >
                        <img
                          src={CATEGORY_ILLUSTRATIONS[category]}
                          alt={category}
                          className={`size-[68px] md:size-[80px] object-contain select-none transition-transform group-hover:scale-[1.06] ${
                            isActive ? 'scale-[1.06]' : ''
                          }`}
                          loading="lazy"
                        />
                        <span
                          className={`text-[11px] font-medium text-center leading-tight line-clamp-2 ${
                            isActive ? 'text-primary' : 'text-foreground/80'
                          }`}
                        >
                          {category}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="px-4 py-8 md:py-9">
        <div className="container max-w-6xl mx-auto grid lg:grid-cols-[240px_1fr] gap-6 lg:gap-9">
          {/* Mobile filter toggle */}
          <div className="lg:hidden flex items-center gap-2 -mb-2">
            <Button
              variant="outline"
              onClick={() => setFiltersOpen((o) => !o)}
              className="rounded-full"
            >
              <Filter className="size-[14px]" />
              Filters
              {activeFilters > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 text-[10px] font-semibold">
                  {activeFilters}
                </span>
              )}
            </Button>
            {activeFilters > 0 && (
              <button onClick={clearAllFilters} className="text-xs text-primary font-medium">
                Clear all
              </button>
            )}
          </div>

          <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block space-y-4`}>
            <div className="bg-card border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4.5 px-[18px] py-4 border-b">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
                  <Filter className="size-[14px] text-[#5C4E46]" />
                  Filters
                </span>
                {activeFilters > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Women-led */}
              <div className="px-[18px] py-3.5 border-b">
                <button
                  onClick={toggleWomenLed}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-[10px] transition-colors"
                  style={{ backgroundColor: womenLedOnly ? '#FEF0E7' : 'transparent' }}
                >
                  <span className="flex items-center gap-2 text-[13px] font-medium" style={{ color: womenLedOnly ? '#C2410C' : undefined }}>
                    <Sparkles className="size-[14px]" style={{ color: womenLedOnly ? '#C2410C' : '#D97706' }} />
                    Women-led
                  </span>
                  <span
                    className="relative w-9 h-5 rounded-full shrink-0 transition-colors"
                    style={{ backgroundColor: womenLedOnly ? '#C2410C' : '#D1CBC4' }}
                  >
                    <span
                      className="absolute top-[3px] size-[14px] rounded-full bg-white shadow-sm transition-[left] duration-200"
                      style={{ left: womenLedOnly ? 'calc(100% - 17px)' : '3px' }}
                    />
                  </span>
                </button>
              </div>

              {/* Startup */}
              <div className="px-[18px] py-3.5 border-b">
                <button
                  onClick={toggleStartup}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-[10px] transition-colors"
                  style={{ backgroundColor: startupOnly ? '#EEF2FF' : 'transparent' }}
                >
                  <span className="flex items-center gap-2 text-[13px] font-medium" style={{ color: startupOnly ? '#4F46E5' : undefined }}>
                    <Rocket className="size-[14px]" style={{ color: startupOnly ? '#4F46E5' : '#6366F1' }} />
                    Startups
                  </span>
                  <span
                    className="relative w-9 h-5 rounded-full shrink-0 transition-colors"
                    style={{ backgroundColor: startupOnly ? '#4F46E5' : '#D1CBC4' }}
                  >
                    <span
                      className="absolute top-[3px] size-[14px] rounded-full bg-white shadow-sm transition-[left] duration-200"
                      style={{ left: startupOnly ? 'calc(100% - 17px)' : '3px' }}
                    />
                  </span>
                </button>
              </div>

              {/* Categories */}
              <div className="px-[18px] py-3.5">
                <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9D8E87] mb-2.5">
                  Category
                </p>
                <div className="flex flex-col">
                  <button
                    onClick={() => setCategory('')}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] transition-colors"
                    style={{
                      backgroundColor: !selectedCategory ? '#FEF0E7' : 'transparent',
                      color: !selectedCategory ? '#C2410C' : '#5C4E46',
                      fontWeight: !selectedCategory ? 600 : 400,
                    }}
                  >
                    <span>All categories</span>
                    <span className="text-[11px] text-[#9D8E87]">{totalCount}</span>
                  </button>
                  {CATEGORIES.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat] || DEFAULT_CATEGORY_ICON
                    const active = selectedCategory === cat
                    const count = categoryCounts[cat] ?? 0
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors hover:bg-[#FAF6F1]"
                        style={{
                          backgroundColor: active ? '#FEF0E7' : undefined,
                          color: active ? '#C2410C' : '#5C4E46',
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        <Icon className="size-[13px] shrink-0" style={{ color: active ? '#C2410C' : '#9D8E87' }} />
                        <span className="flex-1 truncate">{cat}</span>
                        <span className="text-[11px] text-[#9D8E87]">{count}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Own a business CTA */}
            <div
              className="rounded-[14px] px-[18px] py-5 border"
              style={{
                background: 'linear-gradient(135deg, #FEF3E8 0%, #FEF0E7 100%)',
                borderColor: '#F5D9C8',
              }}
            >
              <p className="text-base font-medium text-foreground mb-1.5" style={{ fontFamily: 'Fraunces, serif' }}>
                Own a business?
              </p>
              <p className="text-[13px] text-[color:#5C4E46] mb-3.5 leading-snug">
                Get discovered by your community. It's free.
              </p>
              <Button asChild className="w-full rounded-[10px]">
                <Link to="/list">List your business for Free.</Link>
              </Button>
            </div>
          </aside>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-5">
              <span className="text-[13px] text-[#9D8E87]">
                {loading
                  ? 'Loading…'
                  : `${businesses.length} ${businesses.length === 1 ? 'business' : 'businesses'} found`}
              </span>
              {selectedCategory && (
                <button
                  onClick={() => setCategory('')}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12.5px] font-medium border"
                  style={{ backgroundColor: '#FEF0E7', color: '#C2410C', borderColor: '#F5C0A0' }}
                >
                  {selectedCategory}
                  <X className="size-3" />
                </button>
              )}
              {womenLedOnly && (
                <button
                  onClick={toggleWomenLed}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12.5px] font-medium bg-amber text-amber-foreground border"
                  style={{ borderColor: '#E9C97A' }}
                >
                  Women-led
                  <X className="size-3" />
                </button>
              )}
              {startupOnly && (
                <button
                  onClick={toggleStartup}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12.5px] font-medium bg-indigo-600 text-white border border-indigo-700"
                >
                  Startups
                  <X className="size-3" />
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[260px] bg-muted/50 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : businesses.length === 0 ? (
              <div
                className="text-center py-16 px-6 rounded-2xl border-2 border-dashed"
                style={{ borderColor: '#E8E2DC', backgroundColor: '#FAF6F1' }}
              >
                <Store className="size-12 mx-auto" style={{ color: '#E8E2DC' }} strokeWidth={1.2} />
                <h3 className="text-[22px] font-medium text-foreground mt-5 mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
                  No businesses found
                </h3>
                <p className="text-sm text-[#9D8E87] mb-6 max-w-[300px] mx-auto">
                  Try adjusting your search or clearing the filters
                </p>
                <Button variant="outline" onClick={clearAllFilters} className="rounded-full">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {businesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
