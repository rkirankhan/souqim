import { useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Spinner } from '@/components/ui/spinner'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = z.object({
  fullName: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type SignInFormData = z.infer<typeof signInSchema>
type SignUpFormData = z.infer<typeof signUpSchema>

export function SignInPage() {
  const { user, loading: authLoading } = useAuth()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

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

  async function handleSignIn(data: SignInFormData) {
    setSubmitting(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (authError) throw authError
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSignUp(data: SignUpFormData) {
    setSubmitting(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
        },
      })
      if (authError) throw authError
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleSignIn() {
    setSubmitting(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (authError) throw authError
    } catch (err: any) {
      setError(err?.message || 'Could not start Google sign-in. Please try again.')
      setSubmitting(false)
    }
  }

  function switchMode() {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError(null)
    signInForm.reset()
    signUpForm.reset()
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
            {mode === 'signin' ? 'Sign in to Listmio' : 'Create your account'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === 'signin'
              ? 'Enter your credentials to access your account'
              : 'Fill in the details below to get started'}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={submitting}
              className="w-full h-11 gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2S8.7 5.8 12 5.8c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.9 2 2.8 6.1 2.8 12S6.9 22 12 22c6.9 0 9.5-4.8 9.5-8.7 0-.6-.1-1.1-.2-1.6H12z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {mode === 'signin' ? (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signin-email">Email address</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                    {...signInForm.register('email')}
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Your password"
                    autoComplete="current-password"
                    {...signInForm.register('password')}
                  />
                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11"
                >
                  {submitting ? <Spinner className="size-4" /> : 'Sign in'}
                </Button>
              </form>
            ) : (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-fullName">Full name</Label>
                  <Input
                    id="signup-fullName"
                    type="text"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    autoFocus
                    {...signUpForm.register('fullName')}
                  />
                  {signUpForm.formState.errors.fullName && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">Email address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...signUpForm.register('email')}
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    {...signUpForm.register('password')}
                  />
                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-confirmPassword">Confirm password</Label>
                  <Input
                    id="signup-confirmPassword"
                    type="password"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    {...signUpForm.register('confirmPassword')}
                  />
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11"
                >
                  {submitting ? <Spinner className="size-4" /> : 'Create account'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button onClick={switchMode} className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={switchMode} className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
