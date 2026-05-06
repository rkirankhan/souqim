import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MapPin, Sparkles, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BusinessCard } from '@/components/business-card'
import { supabase } from '@/lib/supabase'
import type { Business } from '@/lib/database.types'
import { CATEGORIES, CATEGORY_ILLUSTRATIONS } from '@/lib/constants'

export function HomePage() {
  const navigate = useNavigate()
  const [focusedField, setFocusedField] = useState<'kw' | 'loc' | null>(null)
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [recentBusinesses, setRecentBusinesses] = useState<Business[]>([])
  const [womenLedBusinesses, setWomenLedBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBusinesses()
  }, [])

  async function loadBusinesses() {
    setLoading(true)
    try {
      const [recentRes, womenRes] = await Promise.all([
        supabase.from('businesses').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('businesses').select('*').eq('is_women_owned', true).order('created_at', { ascending: false }).limit(3),
      ])
      if (recentRes.data) setRecentBusinesses(recentRes.data)
      if (womenRes.data) setWomenLedBusinesses(womenRes.data)
    } catch (error) {
      console.error('Error loading businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (location) params.set('location', location)
    navigate(`/browse?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-6 md:pt-10 pb-14 md:pb-20 px-4" style={{ backgroundColor: '#FEF3E8' }}>
        <div aria-hidden className="hero-blob hero-blob-1 z-[1] -top-20 -left-16 w-[300px] h-[340px] md:w-[540px] md:h-[580px]"
          style={{ backgroundColor: '#C2410C', opacity: 0.17, filter: 'blur(130px)' }} />
        <div aria-hidden className="hero-blob hero-blob-2 z-[1] -top-10 -right-20 w-[260px] h-[280px] md:w-[400px] md:h-[440px]"
          style={{ backgroundColor: '#0F766E', opacity: 0.12, filter: 'blur(100px)' }} />
        <div aria-hidden className="hero-blob hero-blob-3 z-[1] -bottom-12 right-24 w-[220px] h-[250px] md:w-[340px] md:h-[380px]"
          style={{ backgroundColor: '#F59E0B', opacity: 0.09, filter: 'blur(80px)' }} />
        <div aria-hidden className="absolute inset-0 z-[2]" style={{ backgroundColor: 'rgba(254,243,232,0.35)' }} />

        <div className="container max-w-[820px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber text-amber-foreground rounded-full px-3.5 py-1.5 text-xs md:text-[12.5px] font-medium mb-6">
            <Sparkles className="size-3" />
            UK's community business directory
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-[62px] font-medium text-foreground mb-5"
            style={{ fontFamily: 'Fraunces, serif', lineHeight: 1.06, letterSpacing: '-0.03em' }}
          >
            Find any local business<br />
            <em className="text-primary not-italic" style={{ fontStyle: 'italic' }}>worth knowing</em>.
          </h1>

          <p className="text-base md:text-lg text-[color:#5C4E46] max-w-[520px] mx-auto mb-6 leading-[1.65]">
            Discover the small, independent shops, cafés, services and creators in your community.
          </p>

          <div className="max-w-[820px] mx-auto mt-4 md:mt-6 overflow-hidden aspect-[3/1]">
            <img
              src="/hero/community.png"
              alt="Illustration of a diverse community of local business owners — chef, designer, makeup artist, baker, handyman and more"
              className="w-full h-full object-cover object-top select-none pointer-events-none"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Pill search */}
          <div
            className="flex flex-col sm:flex-row bg-card border rounded-[18px] p-[5px] gap-1 max-w-[820px] mx-auto mb-7 transition-all"
            style={{
              borderColor: focusedField ? '#C2410C' : '#E8E2DC',
              boxShadow: focusedField
                ? '0 0 0 4px #FEF0E7, 0 4px 20px rgba(0,0,0,0.06)'
                : '0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="flex-1 flex items-center gap-2 px-4 py-[11px] rounded-[13px] cursor-text transition-colors"
              style={{ background: focusedField === 'kw' ? '#FAF6F1' : 'transparent' }}
              onClick={() => setFocusedField('kw')}
            >
              <Search className="size-[15px] shrink-0" style={{ color: focusedField === 'kw' ? '#C2410C' : '#9D8E87' }} />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Category or keyword…"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-auto p-0 text-sm"
                onFocus={() => setFocusedField('kw')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="hidden sm:block w-px bg-border my-2" />
            <div
              className="flex-1 flex items-center gap-2 px-4 py-[11px] rounded-[13px] cursor-text transition-colors"
              style={{ background: focusedField === 'loc' ? '#FAF6F1' : 'transparent' }}
              onClick={() => setFocusedField('loc')}
            >
              <MapPin className="size-[15px] shrink-0" style={{ color: focusedField === 'loc' ? '#C2410C' : '#9D8E87' }} />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or postcode"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-auto p-0 text-sm"
                onFocus={() => setFocusedField('loc')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="rounded-[13px] h-auto px-7 py-2.5">
              <Search className="size-[14px]" />
              Search
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <button
              onClick={() => navigate('/browse')}
              className="bg-transparent hover:bg-[#FAF6F1] text-[color:#5C4E46] rounded-full px-3 py-1.5 text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              Browse all businesses <ChevronRight className="size-3" />
            </button>
            <span className="text-[#D1CBC4] text-lg">·</span>
            <button
              onClick={() => navigate('/browse?women-led=true')}
              className="bg-amber text-amber-foreground rounded-full px-3.5 py-1.5 text-[13px] font-medium inline-flex items-center gap-1.5"
            >
              <Sparkles className="size-3" />
              Women-led businesses
            </button>
          </div>

          <p className="text-sm text-[color:#5C4E46] mt-6">
            Run a local business?{' '}
            <button
              onClick={() => navigate('/list')}
              className="text-primary font-medium hover:underline underline-offset-2"
            >
              List yours — it’s free →
            </button>
          </p>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section
        className="py-16 md:py-20 px-4 border-b"
        style={{ background: 'linear-gradient(135deg, #FFFBF5 0%, #FEF3E8 50%, #FDE7CE 100%)' }}
      >
        <div className="container max-w-6xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-[0.10em] text-[#9D8E87] uppercase mb-9 md:mb-10">
            Browse by category
          </p>
          {(() => {
            const cats = CATEGORIES.filter((c) => CATEGORY_ILLUSTRATIONS[c])
            if (cats.length === 0) return null
            return (
              <div
                className="flex gap-4 md:gap-6 overflow-x-auto pb-2 -mb-2 scrollbar-thin md:justify-center"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to right, black 0%, black calc(100% - 32px), transparent 100%)',
                  maskImage:
                    'linear-gradient(to right, black 0%, black calc(100% - 32px), transparent 100%)',
                }}
              >
                {cats.map((category) => (
                  <Link
                    key={category}
                    to={`/browse?category=${encodeURIComponent(category)}`}
                    className="group flex-shrink-0 flex flex-col items-center gap-2.5 w-[112px] md:w-[128px]"
                    title={category}
                  >
                    <img
                      src={CATEGORY_ILLUSTRATIONS[category]}
                      alt={category}
                      className="size-[100px] md:size-[120px] object-contain select-none transition-transform group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                    <span className="text-xs md:text-[13px] font-medium text-center leading-tight line-clamp-2 text-foreground/80">
                      {category}
                    </span>
                  </Link>
                ))}
              </div>
            )
          })()}
        </div>
      </section>

      {/* ── WOMEN-LED STRIP ── */}
      {womenLedBusinesses.length > 0 && (
        <section
          className="py-10 md:py-12 px-4 border-b"
          style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF0E7 100%)' }}
        >
          <div className="container max-w-5xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber text-amber-foreground rounded-full px-3 py-1 text-xs font-medium mb-3">
                <Sparkles className="size-3" />
                Featured collection
              </div>
              <h2
                className="text-2xl md:text-[28px] font-medium text-foreground leading-tight mb-2.5"
                style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.01em' }}
              >
                Women-led businesses
              </h2>
              <p className="text-[15px] text-[color:#5C4E46] leading-relaxed mb-5 max-w-sm">
                Discover and support the incredible women entrepreneurs in your community.
              </p>
              <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5">
                <Link to="/browse?women-led=true">
                  <Sparkles className="size-[14px]" />
                  Browse women-led
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {womenLedBusinesses.slice(0, 3).map((business) => (
                <BusinessCard key={business.id} business={business} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RECENTLY LISTED ── */}
      <section className="py-14 md:py-16 px-4 bg-card">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
            <div>
              <h2
                className="text-2xl md:text-[32px] font-medium text-foreground mb-1.5"
                style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.02em' }}
              >
                Recently listed
              </h2>
              <p className="text-sm md:text-[15px] text-[#9D8E87]">Newest businesses on ListMio</p>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/browse">
                View all businesses
                <ArrowRight className="size-[13px]" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted/50 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : recentBusinesses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No businesses yet. Be the first to list!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentBusinesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── DARK CTA ── */}
      <section
        className="py-16 md:py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #1D2939 0%, #0F1A27 100%)' }}
      >
        <div className="container max-w-xl mx-auto text-center">
          <h2
            className="text-3xl md:text-[40px] font-medium text-white mb-4"
            style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Ready to get discovered?
          </h2>
          <p className="text-base md:text-[17px] leading-relaxed text-white/55 mb-9 max-w-[460px] mx-auto">
            Join thousands of small businesses connecting with their community on ListMio. It's completely free.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button asChild size="lg" className="rounded-xl px-8">
              <Link to="/list">List your business — it's free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl bg-transparent border-white/30 text-white/80 hover:bg-white/5 hover:text-white hover:border-white/60"
            >
              <Link to="/about">Learn more</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
