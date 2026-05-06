import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Globe, ArrowLeft, ExternalLink, Sparkles, ChevronLeft, ChevronRight, X, Rocket, Hop as Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { BusinessCard } from '@/components/business-card'
import { supabase } from '@/lib/supabase'
import { isUuid } from '@/lib/slug'
import type { Business } from '@/lib/database.types'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

type IconProps = { className?: string }

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.16a8.16 8.16 0 0 0 4.77 1.52V6.32a4.85 4.85 0 0 1-1.84-.63z" />
    </svg>
  )
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export function BusinessProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [business, setBusiness] = useState<Business | null>(null)
  const [relatedBusinesses, setRelatedBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<
    'about' | 'services' | 'gallery' | 'posts' | null
  >(null)

  // Cover image leads the gallery, then the rest in their original order.
  const galleryPhotos = (() => {
    const list = business?.photos ?? []
    const cover = business?.image_url
    if (!cover || !list.includes(cover)) return list
    return [cover, ...list.filter((u) => u !== cover)]
  })()

  useEffect(() => {
    if (id) {
      loadBusiness(id)
    }
  }, [id])

  // Keyboard navigation for the lightbox.
  useEffect(() => {
    if (lightboxIndex === null) return
    const total = galleryPhotos.length
    if (total === 0) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + total) % total))
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % total))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, galleryPhotos.length])

  async function loadBusiness(slugOrId: string) {
    setLoading(true)
    try {
      const lookupColumn = isUuid(slugOrId) ? 'id' : 'slug'
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq(lookupColumn, slugOrId)
        .maybeSingle()

      if (error) throw error

      const businessData = data as Business | null
      setBusiness(businessData)

      if (businessData?.categories?.length) {
        const { data: related } = await supabase
          .from('businesses')
          .select('*')
          .contains('categories', [businessData.categories[0]])
          .neq('id', businessData.id)
          .limit(3)

        if (related) {
          setRelatedBusinesses(related as Business[])
        }
      }
    } catch (error) {
      console.error('Error loading business:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-64 bg-muted/50 animate-pulse" />
        <div className="container max-w-4xl mx-auto px-4">
          <div className="space-y-6 py-12">
            <div className="h-32 bg-muted/50 animate-pulse rounded-xl" />
            <div className="h-48 bg-muted/50 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-medium mb-4">Business Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The business you're looking for doesn't exist.
          </p>
          <Button asChild className="rounded-full">
            <Link to="/browse">Browse Businesses</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bg-foreground">
        <div className="container max-w-4xl mx-auto px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-2 text-background/80 hover:bg-background/10 hover:text-background transition-colors"
          >
            <Link to="/browse">
              <ArrowLeft className="size-4" data-icon="inline-start" />
              Back to explore
            </Link>
          </Button>
        </div>
      </div>
      {business.image_url ? (
        <button
          type="button"
          onClick={() => {
            const idx = galleryPhotos.findIndex((u) => u === business.image_url)
            setLightboxIndex(idx >= 0 ? idx : 0)
          }}
          aria-label="Open cover photo"
          className="block w-full h-44 sm:h-52 md:h-64 overflow-hidden bg-muted relative cursor-zoom-in group"
        >
          <img
            src={business.image_url}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        </button>
      ) : (
        <div className="relative h-32 md:h-40 overflow-hidden" style={{ backgroundColor: '#FEF3E8' }}>
          <div aria-hidden className="absolute -top-16 -left-12 w-[420px] h-[420px] rounded-full blur-3xl" style={{ backgroundColor: '#C2410C', opacity: 0.18 }} />
          <div aria-hidden className="absolute -bottom-20 right-1/4 w-[360px] h-[360px] rounded-full blur-3xl" style={{ backgroundColor: '#F59E0B', opacity: 0.22 }} />
          <div aria-hidden className="absolute -top-8 right-0 w-[280px] h-[280px] rounded-full blur-3xl" style={{ backgroundColor: '#0F766E', opacity: 0.10 }} />
        </div>
      )}

      <div className="container max-w-4xl mx-auto px-4 -mt-16 md:-mt-20 relative z-10">
        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 mb-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.name}
                className="size-24 md:size-28 rounded-full object-cover ring-4 ring-card shrink-0 bg-card"
              />
            ) : (
              <div className="size-24 md:size-28 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-card shrink-0">
                <span className="text-2xl md:text-3xl font-medium text-primary" style={{ fontFamily: 'Fraunces, serif' }}>
                  {getInitials(business.name)}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              {(business.is_women_owned || business.is_startup || business.is_home_based) && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {business.is_women_owned && (
                    <div className="inline-flex items-center gap-1.5 bg-amber text-amber-foreground rounded-full px-3 py-1 text-xs font-semibold tracking-wide ring-1 ring-amber-foreground/10">
                      <Sparkles className="size-3.5" />
                      Women-led business
                    </div>
                  )}
                  {business.is_startup && (
                    <div className="inline-flex items-center gap-1.5 bg-indigo-600 text-white rounded-full px-3 py-1 text-xs font-semibold tracking-wide ring-1 ring-indigo-700/20">
                      <Rocket className="size-3.5" />
                      Startup
                    </div>
                  )}
                  {business.is_home_based && (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ring-1 ring-emerald-200">
                      <Home className="size-3.5" />
                      Home-based
                    </div>
                  )}
                </div>
              )}
              <h1
                className="text-3xl md:text-[40px] font-medium mb-2 leading-tight tracking-tight"
                style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.02em' }}
              >
                {business.name}
              </h1>
              {business.tagline && (
                <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed">
                  {business.tagline}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-5">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {business.location}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-5 border-t border-border">
                {(business.categories ?? []).map((cat) => (
                  <Badge
                    key={cat}
                    className="rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 font-medium"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {(business.email ||
          business.phone ||
          business.website ||
          business.social_facebook ||
          business.social_instagram ||
          business.social_tiktok ||
          business.social_linkedin) && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <p className="text-xs font-semibold tracking-[0.10em] uppercase text-muted-foreground mb-4">
              Contact &amp; links
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              {business.email && (
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-start gap-3 group"
                >
                  <Mail className="size-5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors break-all">
                      {business.email}
                    </span>
                  </div>
                </a>
              )}
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-start gap-3 group"
                >
                  <Phone className="size-5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {business.phone}
                    </span>
                  </div>
                </a>
              )}
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <Globe className="size-5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Website</p>
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors inline-flex items-center gap-1 truncate">
                      {business.website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="size-3 shrink-0" />
                    </span>
                  </div>
                </a>
              )}
            </div>

            {(business.social_instagram ||
              business.social_tiktok ||
              business.social_linkedin ||
              business.social_facebook) && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                {business.social_instagram && (
                  <a
                    href={business.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <InstagramIcon className="size-4" />
                  </a>
                )}
                {business.social_tiktok && (
                  <a
                    href={business.social_tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <TikTokIcon className="size-4" />
                  </a>
                )}
                {business.social_linkedin && (
                  <a
                    href={business.social_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <LinkedinIcon className="size-4" />
                  </a>
                )}
                {business.social_facebook && (
                  <a
                    href={business.social_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <FacebookIcon className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {(() => {
          const hasServices = !!(business.services && business.services.length > 0)
          const hasHours =
            !!business.opening_hours &&
            Object.values(business.opening_hours).some((d) => d?.open)
          const hasGallery = !!(business.photos && business.photos.length > 0)
          const tabs: {
            key: 'about' | 'services' | 'gallery' | 'posts'
            label: string
            show: boolean
          }[] = [
            { key: 'about', label: 'About', show: true },
            { key: 'services', label: 'Services', show: hasServices },
            { key: 'gallery', label: 'Gallery', show: hasGallery },
            { key: 'posts', label: 'Posts', show: true },
          ]
          const visible = tabs.filter((t) => t.show)
          const current =
            activeTab && visible.some((t) => t.key === activeTab) ? activeTab : 'about'

          return (
            <div className="mb-12">
              <div
                role="tablist"
                className="inline-flex p-1 rounded-full bg-muted/60 mb-6 overflow-x-auto scrollbar-thin"
              >
                {visible.map((t) => {
                  const isActive = current === t.key
                  return (
                    <button
                      key={t.key}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(t.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-card text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>

              {current === 'about' && (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2
                      className="text-xl font-medium mb-3"
                      style={{ fontFamily: 'Fraunces, serif' }}
                    >
                      About
                    </h2>
                    <p className="text-foreground/85 leading-relaxed whitespace-pre-line">
                      {business.description || 'No additional information available.'}
                    </p>
                  </div>

                  {hasHours && (() => {
                    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] as const
                    const today = days[(new Date().getDay() + 6) % 7] // JS: 0=Sun -> our index
                    const now = new Date()
                    const nowMin = now.getHours() * 60 + now.getMinutes()
                    const todayHours = business.opening_hours?.[today]
                    const isOpenNow = (() => {
                      if (!todayHours?.open) return false
                      const [sh, sm] = todayHours.start.split(':').map(Number)
                      const [eh, em] = todayHours.end.split(':').map(Number)
                      return nowMin >= sh * 60 + sm && nowMin <= eh * 60 + em
                    })()

                    return (
                      <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                          <h3
                            className="text-lg font-medium"
                            style={{ fontFamily: 'Fraunces, serif' }}
                          >
                            Opening hours
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              isOpenNow
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                : 'bg-muted text-muted-foreground ring-1 ring-border'
                            }`}
                          >
                            <span className={`size-1.5 rounded-full ${isOpenNow ? 'bg-emerald-500' : 'bg-muted-foreground/60'}`} />
                            {isOpenNow ? 'Open now' : 'Closed'}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2">
                          {days.map((day) => {
                            const d = business.opening_hours?.[day]
                            const isToday = day === today
                            return (
                              <div
                                key={day}
                                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm ${
                                  isToday
                                    ? 'bg-primary/8 ring-1 ring-primary/20'
                                    : 'bg-muted/40'
                                }`}
                              >
                                <span className={`font-medium ${isToday ? 'text-primary' : ''}`}>
                                  {day.slice(0, 3)}
                                  {isToday && <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">Today</span>}
                                </span>
                                {d?.open ? (
                                  <span className="tabular-nums font-medium">
                                    {d.start} – {d.end}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">Closed</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

              {current === 'services' && hasServices && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="divide-y divide-border">
                    {business.services!.map((s, i) => (
                      <li key={i} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="font-medium text-foreground">{s.title}</p>
                          {s.price && (
                            <p className="text-sm font-medium text-primary whitespace-nowrap">
                              {s.price}
                            </p>
                          )}
                        </div>
                        {s.description && (
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {s.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {current === 'gallery' && hasGallery && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryPhotos.map((url, i) => {
                    const isCover = url === business.image_url
                    return (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setLightboxIndex(i)}
                        className="relative block aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity cursor-zoom-in"
                      >
                        <img
                          src={url}
                          alt={`${business.name} photo ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isCover && (
                          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Cover
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {current === 'posts' && (
                <div className="bg-card border border-border rounded-2xl p-10 text-center">
                  <p className="text-sm font-semibold tracking-[0.10em] uppercase text-muted-foreground mb-2">
                    Coming soon
                  </p>
                  <h3
                    className="text-xl font-medium mb-2"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    No posts yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Soon, businesses will be able to share offers, news and
                    events from their listing here.
                  </p>
                </div>
              )}

            </div>
          )
        })()}

        <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-0 shadow-none [&>button]:hidden">
            <DialogTitle className="sr-only">
              {business.name} photo gallery
            </DialogTitle>
            <DialogDescription className="sr-only">
              Use the previous and next buttons or arrow keys to browse photos.
            </DialogDescription>
            {lightboxIndex !== null && galleryPhotos[lightboxIndex] && (
              <div className="relative">
                <img
                  src={galleryPhotos[lightboxIndex]}
                  alt={`${business.name} photo ${lightboxIndex + 1}`}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg select-none"
                  draggable={false}
                />

                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Close"
                  className="absolute top-3 right-3 size-9 rounded-full bg-foreground/70 text-background flex items-center justify-center hover:bg-foreground/85 transition-colors"
                >
                  <X className="size-4" />
                </button>

                {galleryPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((i) =>
                          i === null ? null : (i - 1 + galleryPhotos.length) % galleryPhotos.length,
                        )
                      }
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-11 rounded-full bg-foreground/70 text-background flex items-center justify-center hover:bg-foreground/85 transition-colors"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((i) =>
                          i === null ? null : (i + 1) % galleryPhotos.length,
                        )
                      }
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 size-11 rounded-full bg-foreground/70 text-background flex items-center justify-center hover:bg-foreground/85 transition-colors"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground/75 text-background text-xs font-medium tabular-nums px-3 py-1 rounded-full">
                      {lightboxIndex + 1} / {galleryPhotos.length}
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {relatedBusinesses.length > 0 && (
          <div className="py-12 border-t">
            <h2 className="text-2xl font-medium mb-6">You might also like</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedBusinesses.map((relatedBusiness) => (
                <BusinessCard key={relatedBusiness.id} business={relatedBusiness} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
