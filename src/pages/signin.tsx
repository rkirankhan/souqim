import { useState } from 'react'
import { useSearchParams, Navigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Spinner } from '@/components/ui/spinner'

export function SignInPage() {
  const { user, loading: authLoading } = useAuth()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={returnTo} replace />
  }

  async function handleGoogleSignIn() {
    setSubmitting(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
        },
      })
      if (authError) throw authError
    } catch (err: any) {
      setError(err?.message || 'Could not start Google sign-in. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span
            className="text-2xl font-medium text-primary inline-block mb-6"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Listmio
          </span>
          <h1 className="text-2xl font-medium mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
            Sign in to Listmio
          </h1>
          <p className="text-muted-foreground text-sm">
            Continue with Google to manage your business listings.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={submitting}
              className="w-full h-11 gap-2"
            >
              {submitting ? (
                <Spinner className="size-4" />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#fff" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2S8.7 5.8 12 5.8c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.9 2 2.8 6.1 2.8 12S6.9 22 12 22c6.9 0 9.5-4.8 9.5-8.7 0-.6-.1-1.1-.2-1.6H12z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-foreground transition-colors">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
