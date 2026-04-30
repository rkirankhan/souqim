import { useEffect, useState, useMemo } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import type { Business } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import {
  Search, Eye, Pencil, ExternalLink, Pause, Play, Star, Trash2, Sparkles, ShieldCheck, Check, X,
} from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  live: 'bg-secondary text-secondary-foreground hover:bg-secondary',
  paused: 'bg-muted text-muted-foreground hover:bg-muted',
  draft: 'bg-amber text-amber-foreground hover:bg-amber',
  pending: 'bg-primary text-primary-foreground hover:bg-primary',
}

export function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'live' | 'paused' | 'draft'>('pending')

  useEffect(() => {
    if (isAdmin) loadAll()
  }, [isAdmin])

  async function loadAll() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setBusinesses((data as Business[]) || [])
    } catch (err: any) {
      console.error('Admin load failed:', err)
      toast.error('Could not load listings: ' + (err?.message ?? 'unknown error'))
    } finally {
      setLoading(false)
    }
  }

  async function patchBusiness(id: string, patch: Partial<Business>) {
    setBusyId(id)
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ ...patch, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
      if (error) throw error
      setBusinesses((prev) => prev.map((b) => b.id === id ? { ...b, ...patch } as Business : b))
    } catch (err: any) {
      console.error('Patch failed:', err)
      toast.error('Update failed: ' + (err?.message ?? 'unknown error'))
    } finally {
      setBusyId(null)
    }
  }

  async function deleteBusiness(business: Business) {
    if (!confirm(`Delete "${business.name}" permanently? This cannot be undone.`)) return
    setBusyId(business.id)
    try {
      const { error } = await supabase.from('businesses').delete().eq('id', business.id)
      if (error) throw error
      setBusinesses((prev) => prev.filter((b) => b.id !== business.id))
      toast.success(`Deleted "${business.name}"`)
    } catch (err: any) {
      console.error('Delete failed:', err)
      toast.error('Delete failed: ' + (err?.message ?? 'unknown error'))
    } finally {
      setBusyId(null)
    }
  }

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      if (filter) {
        const f = filter.toLowerCase()
        if (
          !b.name.toLowerCase().includes(f) &&
          !b.location.toLowerCase().includes(f) &&
          !(b.email ?? '').toLowerCase().includes(f) &&
          !(b.categories ?? []).some((c) => c.toLowerCase().includes(f))
        ) return false
      }
      return true
    })
  }, [businesses, filter, statusFilter])

  const counts = useMemo(() => ({
    all: businesses.length,
    pending: businesses.filter((b) => b.status === 'pending').length,
    live: businesses.filter((b) => b.status === 'live').length,
    paused: businesses.filter((b) => b.status === 'paused').length,
    draft: businesses.filter((b) => b.status === 'draft').length,
    featured: businesses.filter((b) => b.is_featured).length,
  }), [businesses])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground mb-2">
              <ShieldCheck className="size-3.5" />
              Admin
            </p>
            <h1 className="text-3xl font-medium" style={{ fontFamily: 'Fraunces, serif' }}>
              Manage listings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {counts.pending > 0 && (
                <span className="text-primary font-medium">{counts.pending} pending review · </span>
              )}
              {counts.all} total · {counts.live} live · {counts.paused} paused · {counts.featured} featured
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap mb-6">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search name, location, email, category…"
              className="h-10 pl-10"
            />
          </div>
          <div className="flex gap-1 bg-muted rounded-full p-1">
            {(['pending', 'live', 'paused', 'draft', 'all'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-xs font-medium rounded-full capitalize transition-colors ${
                  statusFilter === s ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s} ({counts[s as keyof typeof counts] ?? 0})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="size-8" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-xl">
            <p className="text-sm text-muted-foreground">No listings match your filters.</p>
          </div>
        ) : (
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground p-3">Name</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground p-3 hidden md:table-cell">Location</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground p-3 hidden lg:table-cell">Owner</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground p-3">Status</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground p-3 hidden md:table-cell">Views</th>
                  <th className="text-right font-medium text-xs uppercase tracking-wider text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/30">
                    <td className="p-3 align-middle">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{b.name}</span>
                        {b.is_women_owned && (
                          <Badge className="bg-amber text-amber-foreground hover:bg-amber text-[10px] px-1.5 py-0 h-4">
                            <Sparkles className="size-2.5" /> W
                          </Badge>
                        )}
                        {b.is_featured && (
                          <Badge className="bg-primary text-primary-foreground hover:bg-primary text-[10px] px-1.5 py-0 h-4">
                            <Star className="size-2.5" /> Featured
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[260px]">
                        {(b.categories ?? []).join(', ') || '—'}
                      </div>
                    </td>
                    <td className="p-3 align-middle hidden md:table-cell text-muted-foreground">{b.location}</td>
                    <td className="p-3 align-middle hidden lg:table-cell text-muted-foreground text-xs truncate max-w-[180px]">
                      {b.email ?? <span className="opacity-50">—</span>}
                    </td>
                    <td className="p-3 align-middle">
                      <Badge className={STATUS_COLOR[b.status] || STATUS_COLOR.draft}>{b.status}</Badge>
                    </td>
                    <td className="p-3 align-middle hidden md:table-cell text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="size-3" />{b.view_count ?? 0}
                      </span>
                    </td>
                    <td className="p-3 align-middle">
                      <div className="flex items-center justify-end gap-1">
                        {busyId === b.id ? (
                          <Spinner className="size-4 mr-2" />
                        ) : (
                          <>
                            {b.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-8 bg-primary text-primary-foreground"
                                  onClick={() => patchBusiness(b.id, { status: 'live' })}
                                  title="Approve — publish to live"
                                >
                                  <Check className="size-3.5" />
                                  <span className="hidden md:inline">Approve</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-destructive hover:text-destructive"
                                  onClick={() => patchBusiness(b.id, { status: 'paused' })}
                                  title="Reject — set to paused"
                                >
                                  <X className="size-3.5" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => patchBusiness(b.id, { is_featured: !b.is_featured })}
                              title={b.is_featured ? 'Unfeature' : 'Mark featured'}
                            >
                              <Star className={`size-3.5 ${b.is_featured ? 'fill-current text-primary' : ''}`} />
                            </Button>
                            {b.status !== 'pending' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8"
                                onClick={() =>
                                  patchBusiness(b.id, { status: b.status === 'live' ? 'paused' : 'live' })
                                }
                                title={b.status === 'live' ? 'Pause' : 'Make live'}
                              >
                                {b.status === 'live' ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                              </Button>
                            )}
                            <Button asChild size="sm" variant="ghost" className="h-8" title="View public page">
                              <a href={`/business/${b.id}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="size-3.5" />
                              </a>
                            </Button>
                            <Button asChild size="sm" variant="ghost" className="h-8" title="Edit">
                              <Link to={`/dashboard/edit/${b.id}`}>
                                <Pencil className="size-3.5" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-destructive hover:text-destructive"
                              onClick={() => deleteBusiness(b)}
                              title="Delete"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
