import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Globe, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
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

export function BusinessProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [business, setBusiness] = useState<Business | null>(null)
  const [relatedBusinesses, setRelatedBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<
    'about' | 'services' | 'gallery' | 'posts' | 'contact' | null
  >(null)

  useEffect(() => {
    if (id) {
      loadBusiness(id)
    }
  }, [id])

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
      <div className="relative h-20 md:h-24 bg-gradient-to-br from-primary/20 to-primary/5" />

      <div className="container max-w-4xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {(business.logo_url || business.image_url) ? (
              <img
                src={business.logo_url || business.image_url!}
                alt={business.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-card shadow-md">
                <span className="text-2xl font-medium text-primary">{getInitials(business.name)}</span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {(business.categories ?? []).map((cat) => (
                  <Badge
                    key={cat}
                    className="rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  >
                    {cat}
                  </Badge>
                ))}
                {business.is_women_owned && (
                  <Badge className="rounded-full bg-amber text-amber-foreground hover:bg-amber">
                    <Sparkles className="size-3 shrink-0" />
                    Women-Led Business
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-medium mb-2">{business.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">
                {business.description || 'Building something amazing'}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" />
                <span>{business.location}</span>
              </div>
            </div>
          </div>
        </div>

        {(() => {
          const hasServices = !!(business.services && business.services.length > 0)
          const hasHours =
            !!business.opening_hours &&
            Object.values(business.opening_hours).some((d) => d?.open)
          const hasGallery = !!(business.photos && business.photos.length > 0)
          const hasContact = !!(
            business.email ||
            business.phone ||
            business.website ||
            business.social_facebook ||
            business.social_twitter ||
            business.social_instagram ||
            business.social_linkedin
          )
          const tabs: {
            key: 'about' | 'services' | 'gallery' | 'posts' | 'contact'
            label: string
            show: boolean
          }[] = [
            { key: 'about', label: 'About', show: true },
            { key: 'services', label: 'Services', show: hasServices },
            { key: 'gallery', label: 'Gallery', show: hasGallery },
            { key: 'posts', label: 'Posts', show: true },
            { key: 'contact', label: 'Contact & links', show: hasContact },
          ]
          const visible = tabs.filter((t) => t.show)
          const current =
            activeTab && visible.some((t) => t.key === activeTab) ? activeTab : 'about'

          return (
            <div className="mb-12">
              <div
                role="tablist"
                className="flex gap-1 border-b border-border mb-6 overflow-x-auto scrollbar-thin"
              >
                {visible.map((t) => {
                  const isActive = current === t.key
                  return (
                    <button
                      key={t.key}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(t.key)}
                      className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t.label}
                      {isActive && (
                        <span className="absolute -bottom-px left-2 right-2 h-0.5 bg-primary rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>

              {current === 'about' && (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-xl p-6">
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

                  {hasHours && (
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3
                        className="text-lg font-medium mb-3"
                        style={{ fontFamily: 'Fraunces, serif' }}
                      >
                        Opening hours
                      </h3>
                      <ul className="divide-y divide-border">
                        {(
                          [
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday',
                            'Saturday',
                            'Sunday',
                          ] as const
                        ).map((day) => {
                          const d = business.opening_hours?.[day]
                          return (
                            <li
                              key={day}
                              className="flex items-center justify-between py-2 text-sm"
                            >
                              <span className="font-medium">{day}</span>
                              {d?.open ? (
                                <span className="text-foreground/80 tabular-nums">
                                  {d.start} – {d.end}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">Closed</span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
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
                  {business.photos!.map((url, i) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setLightboxUrl(url)}
                      className="block aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity cursor-zoom-in"
                    >
                      <img
                        src={url}
                        alt={`${business.name} photo ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {current === 'posts' && (
                <div className="bg-card border border-border rounded-xl p-10 text-center">
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

              {current === 'contact' && hasContact && (
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  {business.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="size-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                        <a
                          href={`mailto:${business.email}`}
                          className="text-foreground hover:text-primary transition-colors"
                        >
                          {business.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="size-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                        <a
                          href={`tel:${business.phone}`}
                          className="text-foreground hover:text-primary transition-colors"
                        >
                          {business.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="size-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Website</p>
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          {business.website.replace(/^https?:\/\//, '')}
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {(business.social_facebook ||
                    business.social_twitter ||
                    business.social_instagram ||
                    business.social_linkedin) && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs font-semibold tracking-[0.10em] uppercase text-muted-foreground mb-3">
                        Follow
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {business.social_facebook && (
                          <Button asChild variant="outline" size="sm" className="rounded-full">
                            <a
                              href={business.social_facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Facebook
                            </a>
                          </Button>
                        )}
                        {business.social_twitter && (
                          <Button asChild variant="outline" size="sm" className="rounded-full">
                            <a
                              href={business.social_twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Twitter
                            </a>
                          </Button>
                        )}
                        {business.social_instagram && (
                          <Button asChild variant="outline" size="sm" className="rounded-full">
                            <a
                              href={business.social_instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Instagram
                            </a>
                          </Button>
                        )}
                        {business.social_linkedin && (
                          <Button asChild variant="outline" size="sm" className="rounded-full">
                            <a
                              href={business.social_linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              LinkedIn
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })()}

        <Dialog open={lightboxUrl !== null} onOpenChange={(open) => !open && setLightboxUrl(null)}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
            {lightboxUrl && (
              <img
                src={lightboxUrl}
                alt={business.name}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
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
