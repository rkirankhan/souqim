import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import type { Business } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  Store, Eye, Pencil, ExternalLink, Pause, Play, Plus, Sparkles, MapPin, Trash,
} from 'lucide-react'

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  live: { label: 'Live', className: 'bg-secondary text-secondary-foreground hover:bg-secondary' },
  paused: { label: 'Paused', className: 'bg-muted text-muted-foreground hover:bg-muted' },
  draft: { label: 'Draft', className: 'bg-amber text-amber-foreground hover:bg-amber' },
  pending: { label: 'Pending review', className: 'bg-amber text-amber-foreground hover:bg-amber' },
}

export function DashboardPage() {
  const { user, displayName } = useAuth()
  const location = useLocation()
  // If the listing form just navigated here, it passes the inserted row in
  // router state so we can render it instantly — bypassing the brief window
  // where Supabase has committed the row but our select hasn't seen it yet.
  const freshListing = (location.state as { freshListing?: Business } | null)?.freshListing ?? null
  const [businesses, setBusinesses] = useState<Business[]>(freshListing ? [freshListing] : [])
  const [loading, setLoading] = useState(!freshListing)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) claimAndLoad()
  }, [user])

  async function claimAndLoad(attempt = 1) {
    if (attempt === 1 && !freshListing) setLoading(true)
    try {
      const email = user!.email || ''
      if (email) {
        const { data: drafts } = await supabase
          .from('businesses')
          .select('id')
          .eq('pending_email', email)
          .eq('status', 'draft')
          .is('owner_id', null)

        if (drafts && drafts.length > 0) {
          for (const draft of drafts) {
            await supabase
              .from('businesses')
              .update({
                owner_id: user!.id,
                status: 'live' as const,
                pending_email: null,
                updated_at: new Date().toISOString(),
              } as any)
              .eq('id', draft.id)
          }
        }
      }

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      const rows = (data as Business[]) || []

      // Edge case: the dashboard mounted before the just-inserted row was
      // readable. Retry once after a short delay before showing empty state.
      if (rows.length === 0 && attempt < 2 && businesses.length === 0) {
        setTimeout(() => claimAndLoad(2), 800)
        return
      }
      setBusinesses(rows)
    } catch (err) {
      console.error('Error loading businesses:', err)
      toast.error('Failed to load your listings.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleStatus(business: Business) {
    const newStatus: 'live' | 'paused' = business.status === 'live' ? 'paused' : 'live'
    setTogglingId(business.id)
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status: newStatus, updated_at: new Date().toISOString() } as any)
        .eq('id', business.id)

      if (error) throw error

      setBusinesses((prev) =>
        prev.map((b) => b.id === business.id ? { ...b, status: newStatus } : b)
      )
      toast.success(newStatus === 'live' ? 'Listing is now live.' : 'Listing has been paused.')
    } catch (err) {
      console.error('Error toggling status:', err)
      toast.error('Failed to update listing status.')
    } finally {
      setTogglingId(null)
    }
  }

  async function deleteBusiness(business: Business) {
    setDeletingId(business.id)
    try {
      const { error } = await supabase.from('businesses').delete().eq('id', business.id)
      if (error) throw error
      setBusinesses((prev) => prev.filter((b) => b.id !== business.id))
      toast.success(`'${business.name}' has been deleted.`)
    } catch (err) {
      console.error('Error deleting listing:', err)
      toast.error('Failed to delete listing. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const firstName = displayName.split(' ')[0] || displayName

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-medium mb-1" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground">Manage your business listings</p>
        </div>

        {businesses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {businesses.map((business) => (
              <BusinessListingCard
                key={business.id}
                business={business}
                toggling={togglingId === business.id}
                deleting={deletingId === business.id}
                onToggleStatus={() => toggleStatus(business)}
                onDelete={() => deleteBusiness(business)}
              />
            ))}

            <div className="pt-4">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/list">
                  <Plus className="size-4" />
                  Add another listing
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="py-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <Store className="size-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium mb-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
          You haven't listed a business yet
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Get discovered by your community. List your business and start reaching new customers today.
        </p>
        <Button asChild className="rounded-full h-11 px-6">
          <Link to="/list">List your business</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

interface BusinessListingCardProps {
  business: Business
  toggling: boolean
  deleting: boolean
  onToggleStatus: () => void
  onDelete: () => void
}

function BusinessListingCard({
  business,
  toggling,
  deleting,
  onToggleStatus,
  onDelete,
}: BusinessListingCardProps) {
  const status = STATUS_BADGE[business.status] || STATUS_BADGE.draft

  const displayImage = business.logo_url || business.image_url

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-[120px] sm:h-[120px] h-40 shrink-0">
            {displayImage ? (
              <img
                src={displayImage}
                alt={business.name}
                className={`w-full h-full ${business.logo_url ? 'object-contain p-3' : 'object-cover'}`}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Store className="size-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-medium text-foreground truncate">{business.name}</h3>
                  {business.is_women_owned && (
                    <Badge className="shrink-0 bg-amber text-amber-foreground hover:bg-amber text-xs">
                      <Sparkles className="size-3" />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{(business.categories ?? []).join(', ')}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    {business.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge className={status.className}>{status.label}</Badge>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Eye className="size-3" />
                  {business.view_count}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap mt-auto">
              <Button asChild size="sm" variant="outline" className="rounded-full h-8">
                <Link to={`/dashboard/edit/${business.id}`}>
                  <Pencil className="size-3.5" />
                  Edit
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="rounded-full h-8">
                <a href={`/business/${business.slug || business.id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" />
                  Preview
                </a>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full h-8"
                disabled={toggling}
                onClick={onToggleStatus}
              >
                {toggling ? (
                  <Spinner className="size-3.5" />
                ) : business.status === 'live' ? (
                  <>
                    <Pause className="size-3.5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" />
                    Resume
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-auto"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <>
                        <Trash className="size-3.5" />
                        Delete
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                    <AlertDialogDescription>
                      <span className="font-medium text-foreground">{business.name}</span>{' '}
                      will be removed from souqim for good. This can&rsquo;t be
                      undone &mdash; the listing, photos and stats will all be
                      gone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      disabled={deleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleting ? <Spinner className="size-4" /> : 'Yes, delete it'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
