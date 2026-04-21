import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Globe, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BusinessCard } from '@/components/business-card'
import { supabase } from '@/lib/supabase'
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

  useEffect(() => {
    if (id) {
      loadBusiness(id)
    }
  }, [id])

  async function loadBusiness(businessId: string) {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .maybeSingle()

      if (error) throw error

      const businessData = data as Business | null
      setBusiness(businessData)

      if (businessData?.categories?.length) {
        const { data: related } = await supabase
          .from('businesses')
          .select('*')
          .contains('categories', [businessData.categories[0]])
          .neq('id', businessId)
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
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="absolute inset-0 flex items-end">
          <div className="container max-w-4xl mx-auto px-4 pb-6">
            <Button variant="ghost" asChild className="mb-4 hover:bg-card/80">
              <Link to="/browse">
                <ArrowLeft className="size-4" data-icon="inline-start" />
                Back to explore
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 -mt-16 relative z-10">
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
                  <Badge key={cat} variant="secondary" className="rounded-full">
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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {business.description || 'No additional information available.'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">Contact & Links</h2>
            <div className="space-y-3">
              {business.email && (
                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
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
                  <Phone className="size-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
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
                  <Globe className="size-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Website</p>
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
              {!business.email && !business.phone && !business.website && (
                <p className="text-sm text-muted-foreground">No contact information available</p>
              )}
            </div>
          </div>
        </div>

        {(business.social_facebook || business.social_twitter || business.social_instagram || business.social_linkedin) && (
          <div className="bg-muted/30 rounded-xl p-6 mb-12">
            <h2 className="text-lg font-medium mb-4">Follow on social media</h2>
            <div className="flex flex-wrap gap-3">
              {business.social_facebook && (
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href={business.social_facebook} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </Button>
              )}
              {business.social_twitter && (
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href={business.social_twitter} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </Button>
              )}
              {business.social_instagram && (
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href={business.social_instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </Button>
              )}
              {business.social_linkedin && (
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href={business.social_linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

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
