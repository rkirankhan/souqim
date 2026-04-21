import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import type { Business, BusinessInsert } from '@/lib/database.types'
import { ListingForm, type ListingFormData } from '@/components/listing-form'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

export function AddBusinessPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/signin?returnTo=${encodeURIComponent('/add-business')}`} replace />
  }

  async function onSubmit(data: ListingFormData) {
    setSubmitting(true)
    try {
      const businessData: BusinessInsert = {
        name: data.name,
        owner_name: data.owner_name || null,
        owner_id: user!.id,
        categories: data.categories,
        description: data.description,
        tagline: data.tagline || null,
        location: data.location,
        postcode: data.postcode,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        social_facebook: data.social_facebook || null,
        social_twitter: data.social_twitter || null,
        social_instagram: data.social_instagram || null,
        social_linkedin: data.social_linkedin || null,
        image_url: data.image_url || null,
        is_women_owned: data.is_women_owned,
        is_home_based: data.is_home_based,
        is_startup: data.is_startup,
        status: 'live',
      }

      const { data: resultData, error } = (await supabase
        .from('businesses')
        .insert(businessData as any)
        .select()
        .single()) as { data: Business | null; error: any }

      if (error) throw error
      if (!resultData) throw new Error('No data returned')

      toast.success('Your business has been published!')
      setTimeout(() => navigate(`/business/${resultData.id}`), 800)
    } catch (err) {
      console.error('Error creating business:', err)
      toast.error('Failed to create business listing. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-medium tracking-tight mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
            List Your Business
          </h1>
          <p className="text-muted-foreground">
            Join our community of bold founders and entrepreneurs
          </p>
        </div>

        <ListingForm
          mode="create"
          submitting={submitting}
          onSubmit={onSubmit}
          onCancel={() => navigate('/browse')}
        />
      </div>
    </div>
  )
}
