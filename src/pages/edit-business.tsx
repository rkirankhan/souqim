import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import type { Business } from '@/lib/database.types'
import { ListingForm, type ListingFormData } from '@/components/listing-form'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export function EditBusinessPage() {
  const { id } = useParams<{ id: string }>()
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (id && user) loadBusiness(id)
  }, [id, user, isAdmin])

  async function loadBusiness(businessId: string) {
    setLoading(true)
    try {
      let query = supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
      if (!isAdmin) query = query.eq('owner_id', user!.id)
      const { data, error } = await query.maybeSingle()

      if (error) throw error
      if (!data) {
        setNotFound(true)
        return
      }
      setBusiness(data as Business)
    } catch (err) {
      console.error('Error loading business:', err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(formData: ListingFormData) {
    if (!business) return
    setSubmitting(true)
    try {
      const updateData: Record<string, unknown> = {
        name: formData.name,
        owner_name: formData.owner_name || null,
        categories: formData.categories,
        description: formData.description,
        tagline: formData.tagline || null,
        location: formData.location,
        postcode: formData.postcode,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        image_url: formData.image_url || null,
        logo_url: formData.logo_url || null,
        social_facebook: formData.social_facebook || null,
        social_twitter: formData.social_twitter || null,
        social_instagram: formData.social_instagram || null,
        social_linkedin: formData.social_linkedin || null,
        is_women_owned: formData.is_women_owned,
        is_home_based: formData.is_home_based,
        is_startup: formData.is_startup,
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabase
        .from('businesses')
        .update(updateData as any)
        .eq('id', business.id)

      if (error) throw error
      toast.success('Changes saved.')
      navigate('/dashboard')
    } catch (err) {
      console.error('Error updating business:', err)
      toast.error('Failed to save changes. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (notFound || !business) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-medium mb-4">Listing Not Found</h1>
          <p className="text-muted-foreground mb-8">
            This listing doesn't exist or you don't have permission to edit it.
          </p>
          <Button asChild className="rounded-full">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link to="/dashboard">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-medium tracking-tight mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
            Edit Listing
          </h1>
          <p className="text-muted-foreground">
            Update your business details
          </p>
        </div>

        <ListingForm
          mode="edit"
          defaultValues={{
            name: business.name,
            owner_name: business.owner_name ?? '',
            categories: business.categories ?? [],
            description: business.description,
            tagline: business.tagline ?? '',
            location: business.location,
            postcode: business.postcode,
            phone: business.phone ?? '',
            email: business.email ?? '',
            website: business.website ?? '',
            image_url: business.image_url ?? '',
            logo_url: business.logo_url ?? '',
            social_facebook: business.social_facebook ?? '',
            social_twitter: business.social_twitter ?? '',
            social_instagram: business.social_instagram ?? '',
            social_linkedin: business.social_linkedin ?? '',
            is_women_owned: business.is_women_owned,
            is_home_based: business.is_home_based,
            is_startup: business.is_startup,
          }}
          updatedAt={business.updated_at}
          submitting={submitting}
          onSubmit={onSubmit}
          onCancel={() => navigate('/dashboard')}
        />
      </div>
    </div>
  )
}
