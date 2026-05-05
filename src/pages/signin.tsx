import { useState } from 'react'
import { useSearchParams, Navigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Spinner } from '@/components/ui/spinner'

type Mode = 'signin' | 'signup'

export function SignInPage() {
  const { user, loading: authLoading } = useAuth()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [oauthLoading, setOauthLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

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
    setOauthLoading(true)
    setError(null)
    setInfo(null)
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
      setOauthLoading(false)
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }
    if (mode === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'signin') {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError
        // user state will pick up from auth-context; the Navigate at the top handles redirect
      } else {
        const { data, error: authError } = await supabase.auth.signUp({ email, password })
        if (authError) throw authError
        if (data.session) {
          // Email confirmation is OFF — user is already signed in
        } else {
          // Email confirmation is ON — instruct user to check inbox
          setInfo('Check your email for a confirmation link to finish creating your account.')
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email above first, then click Forgot password.')
      return
    }
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (authError) throw authError
      setInfo('Password reset link sent. Check your email.')
    } catch (err: any) {
      setError(err?.message || 'Could not send reset link.')
    } finally {
      setSubmitting(false)
    }
  }

  const isSignup = mode === 'signup'

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
            {isSignup ? 'Create your account' : 'Sign in to Listmio'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSignup
              ? 'Sign up to manage your business listings.'
              : 'Welcome back — sign in to manage your business listings.'}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={oauthLoading || submitting}
              className="w-full h-11 gap-2"
            >
              {oauthLoading ? (
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

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11"
                  disabled={submitting || oauthLoading}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  {!isSignup && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={submitting || oauthLoading}
                      className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                  className="h-11"
                  disabled={submitting || oauthLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={submitting || oauthLoading}
                variant="outline"
                className="w-full h-11"
              >
                {submitting ? <Spinner className="size-4" /> : isSignup ? 'Create account' : 'Sign in'}
              </Button>
            </form>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            {info && <p className="text-sm text-foreground text-center">{info}</p>}

            <div className="text-sm text-center text-muted-foreground pt-1">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setError(null); setInfo(null) }}
                    className="text-foreground font-medium hover:underline underline-offset-2"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(null); setInfo(null) }}
                    className="text-foreground font-medium hover:underline underline-offset-2"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
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
