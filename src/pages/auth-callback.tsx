import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

async function claimDraftListings(userId: string, email: string) {
  const { data: drafts } = await supabase
    .from('businesses')
    .select('id')
    .eq('pending_email', email)
    .eq('status', 'draft')
    .is('owner_id', null)

  if (!drafts || drafts.length === 0) return false

  for (const draft of drafts) {
    await supabase
      .from('businesses')
      .update({
        owner_id: userId,
        status: 'live' as const,
        pending_email: null,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', draft.id)
  }

  return true
}

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const claimed = await claimDraftListings(
          session.user.id,
          session.user.email || ''
        )
        if (claimed) {
          toast.success("You're on SouqIm. Welcome in.")
        }
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/signin', { replace: true })
      }
    })
  }, [navigate, returnTo])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Spinner className="size-8" />
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  )
}
