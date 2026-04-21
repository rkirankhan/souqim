import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { LogOut, Mail, Trash2 } from 'lucide-react'

export function AccountPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [changingEmail, setChangingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleChangeEmail() {
    if (!newEmail.trim()) return
    setEmailSubmitting(true)
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail })
      if (error) throw error
      toast.success('A confirmation link has been sent to your new email address.')
      setChangingEmail(false)
      setNewEmail('')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update email.')
    } finally {
      setEmailSubmitting(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container max-w-lg mx-auto">
        <h1 className="text-3xl font-medium mb-8" style={{ fontFamily: 'Fraunces, serif' }}>
          Account
        </h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-base">
                <Mail className="size-4 text-primary" />
                Email address
              </CardTitle>
              <CardDescription>
                Your sign-in email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Input value={user?.email || ''} readOnly className="bg-muted/50" />
                  {!changingEmail && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChangingEmail(true)}
                      className="shrink-0"
                    >
                      Change
                    </Button>
                  )}
                </div>

                {changingEmail && (
                  <div className="space-y-3 pt-2 border-t">
                    <Label htmlFor="new-email">New email address</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="new@example.com"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleChangeEmail}
                        disabled={emailSubmitting || !newEmail.trim()}
                      >
                        {emailSubmitting ? <Spinner className="size-4" /> : 'Send confirmation'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setChangingEmail(false); setNewEmail('') }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full h-11"
              >
                {signingOut ? (
                  <Spinner className="size-4" />
                ) : (
                  <>
                    <LogOut className="size-4" />
                    Sign out
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-sm text-muted-foreground hover:text-destructive transition-colors inline-flex items-center gap-1.5">
                  <Trash2 className="size-3.5" />
                  Delete account
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Account deletion is not yet available. This feature is coming soon.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => toast('Account deletion is coming soon.')}>
                    I understand
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
