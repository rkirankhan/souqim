import { useState, useRef, useCallback, useEffect } from 'react'
import { generateUniqueSlug } from '@/lib/slug'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { CATEGORIES, CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/lib/constants'
import {
  ArrowLeft, ArrowRight, Check, Upload, X,
  Sparkles, Camera, MapPin, House as Home, ImagePlus, Rocket, Share2, Star,
} from 'lucide-react'
import { toast } from 'sonner'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import type { Business, OpeningHours, OpeningHoursDay } from '@/lib/database.types'

const TOP_CATEGORIES = CATEGORIES.slice(0, 6)

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

const DEFAULT_OPEN_HOURS: OpeningHoursDay = { open: false, start: '09:00', end: '17:00' }

function getDefaultOpeningHours(): OpeningHours {
  return Object.fromEntries(DAYS_OF_WEEK.map((d) => [d, { ...DEFAULT_OPEN_HOURS }]))
}

function hasAnyOpenDay(hours: OpeningHours | null | undefined): boolean {
  if (!hours) return false
  return Object.values(hours).some((d) => d?.open)
}

const listingSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  categories: z.array(z.string()).min(1, 'Please select at least one category').max(3, 'You can select up to 3 categories'),
  tagline: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  postcode: z.string().min(2, 'Postcode is required'),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  is_women_owned: z.boolean(),
  is_home_based: z.boolean(),
  is_startup: z.boolean(),
  social_instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_tiktok: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  services: z
    .array(
      z.object({
        title: z.string().min(1, 'Title required'),
        description: z.string().optional().or(z.literal('')),
        price: z.string().optional().or(z.literal('')),
      }),
    )
    .max(20, 'Up to 20 services')
    .optional(),
})

type ListingFormData = z.infer<typeof listingSchema>

type IconProps = { className?: string }

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.16a8.16 8.16 0 0 0 4.77 1.52V6.32a4.85 4.85 0 0 1-1.84-.63z" />
    </svg>
  )
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function SocialInput({
  icon,
  placeholder,
  register,
}: {
  icon: React.ReactNode
  placeholder: string
  register: ReturnType<ReturnType<typeof useForm<ListingFormData>>['register']>
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        {icon}
      </span>
      <Input type="url" placeholder={placeholder} className="h-12 pl-10" {...register} />
    </div>
  )
}

const STEP_FIELDS: (keyof ListingFormData)[][] = [
  ['name', 'categories', 'tagline', 'description', 'services'],
  ['location', 'city', 'postcode', 'phone', 'email', 'website', 'social_instagram', 'social_tiktok', 'social_linkedin', 'social_facebook'],
  ['is_women_owned', 'is_home_based', 'is_startup'],
]

const STEPS = [
  { label: 'Basics', icon: Sparkles },
  { label: 'Details', icon: MapPin },
  { label: 'Publish', icon: Camera },
]

export function ListPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { id: editId } = useParams<{ id?: string }>()
  const isEditMode = Boolean(editId)
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>([])
  const [logo, setLogo] = useState<{ file: File; preview: string } | null>(null)
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [editLoading, setEditLoading] = useState(isEditMode)
  const [editNotFound, setEditNotFound] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [openingHours, setOpeningHours] = useState<OpeningHours>(getDefaultOpeningHours)
  // The selected cover/hero photo. Stored as either an existing URL
  // (already in DB) or a new photo's local preview blob URL.
  const [coverSelection, setCoverSelection] = useState<string | null>(null)

  function setDayOpen(day: string, open: boolean) {
    setOpeningHours((prev) => ({ ...prev, [day]: { ...prev[day], open } }))
  }
  function setDayTime(day: string, field: 'start' | 'end', value: string) {
    setOpeningHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
  }

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      categories: [],
      tagline: '',
      description: '',
      location: '',
      city: '',
      postcode: '',
      phone: '',
      email: '',
      website: '',
      is_women_owned: false,
      is_home_based: false,
      is_startup: false,
      social_instagram: '',
      social_tiktok: '',
      social_linkedin: '',
      social_facebook: '',
      services: [],
    },
  })

  const selectedCategories = form.watch('categories')

  const servicesField = useFieldArray({ control: form.control, name: 'services' })

  // After sign-in, publish the pending listing inline and go to the dashboard.
  useEffect(() => {
    if (isEditMode || !user) return
    const raw = localStorage.getItem('listmio_pending_listing')
    if (!raw) return
    let cancelled = false
    ;(async () => {
      let parsed: {
        data: ListingFormData
        photoUrls: string[]
        logoUrl: string | null
        openingHours?: OpeningHours | null
      }
      try {
        parsed = JSON.parse(raw)
      } catch {
        localStorage.removeItem('listmio_pending_listing')
        return
      }
      localStorage.removeItem('listmio_pending_listing')
      const { data, photoUrls, logoUrl, openingHours: pendingHours } = parsed
      const addr = (data.location || '').trim()
      const cty = (data.city || '').trim()
      const combinedLocation =
        addr && cty ? `${addr}, ${cty}` : addr || cty || data.postcode
      const slug = await generateUniqueSlug(data.name)
      const insertPayload = {
        slug,
        name: data.name,
        categories: data.categories,
        tagline: data.tagline || null,
        description: data.description,
        location: combinedLocation,
        postcode: data.postcode,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        is_women_owned: data.is_women_owned,
        is_home_based: data.is_home_based,
        is_startup: data.is_startup,
        social_instagram: data.social_instagram || null,
        social_tiktok: data.social_tiktok || null,
        social_linkedin: data.social_linkedin || null,
        social_facebook: data.social_facebook || null,
        services: (data.services || [])
          .map((s) => ({
            title: (s.title || '').trim(),
            description: (s.description || '').trim() || undefined,
            price: (s.price || '').trim() || undefined,
          }))
          .filter((s) => s.title),
        opening_hours: hasAnyOpenDay(pendingHours) ? pendingHours : null,
        photos: photoUrls || [],
        image_url: photoUrls?.[0] || null,
        logo_url: logoUrl ?? null,
        owner_id: user.id,
        status: (isAdmin ? 'live' : 'pending') as 'live' | 'pending',
      }
      try {
        toast.info('Welcome back — publishing your listing now.')
        const { error } = await supabase
          .from('businesses')
          .insert(insertPayload as any)
        if (cancelled) return
        if (error) throw error
        if (isAdmin) {
          toast.success('Your business has been published!')
        } else {
          toast.success("Submitted! We'll review it shortly and let you know.")
        }
        navigate('/dashboard')
      } catch (err: any) {
        console.error('Error auto-publishing pending listing:', err)
        toast.error(err?.message || 'Failed to publish. Please try again.')
        // Fall back: restore the form so the user can retry manually.
        form.reset(data)
        setExistingPhotoUrls(photoUrls || [])
        setExistingLogoUrl(logoUrl ?? null)
      }
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  useEffect(() => {
    if (!isEditMode || !editId || !user) return
    let cancelled = false
    ;(async () => {
      let query = supabase.from('businesses').select('*').eq('id', editId)
      if (!isAdmin) query = query.eq('owner_id', user.id)
      const { data, error } = await query.maybeSingle<Business>()
      if (cancelled) return
      if (error || !data) {
        setEditNotFound(true)
        setEditLoading(false)
        return
      }
      // Saved location is "<address>, <city>"; pre-fill best-effort.
      const lastComma = data.location.lastIndexOf(',')
      const addressPart = lastComma > -1 ? data.location.slice(0, lastComma).trim() : data.location
      const cityPart = lastComma > -1 ? data.location.slice(lastComma + 1).trim() : ''
      form.reset({
        name: data.name,
        categories: data.categories ?? [],
        tagline: data.tagline ?? '',
        description: data.description,
        location: addressPart,
        city: cityPart,
        postcode: data.postcode,
        phone: data.phone ?? '',
        email: data.email ?? '',
        website: data.website ?? '',
        is_women_owned: data.is_women_owned,
        is_home_based: data.is_home_based,
        is_startup: data.is_startup,
        social_instagram: data.social_instagram ?? '',
        social_tiktok: data.social_tiktok ?? '',
        social_linkedin: data.social_linkedin ?? '',
        social_facebook: data.social_facebook ?? '',
        services: (data.services ?? []).map((s) => ({
          title: s?.title ?? '',
          description: s?.description ?? '',
          price: s?.price ?? '',
        })),
      })
      setExistingPhotoUrls(data.photos ?? [])
      setExistingLogoUrl(data.logo_url ?? null)
      // Pre-select the existing hero (image_url) if it's one of the gallery photos.
      if (data.image_url && (data.photos ?? []).includes(data.image_url)) {
        setCoverSelection(data.image_url)
      }
      if (data.opening_hours && typeof data.opening_hours === 'object') {
        // Merge stored values onto a default skeleton so missing days fall back gracefully.
        const defaults = getDefaultOpeningHours()
        const merged = Object.fromEntries(
          DAYS_OF_WEEK.map((d) => [
            d,
            { ...defaults[d], ...((data.opening_hours as OpeningHours)[d] ?? {}) },
          ]),
        ) as OpeningHours
        setOpeningHours(merged)
      }
      setEditLoading(false)
    })()
    return () => { cancelled = true }
  }, [isEditMode, editId, user, isAdmin, form])

  async function goNext() {
    const fields = STEP_FIELDS[step]
    const valid = await form.trigger(fields)
    if (valid) {
      setStep((s) => Math.min(s + 1, 2))
    } else {
      // Validation failed — scroll the first error into view so the user
      // sees what's wrong instead of being stranded at the bottom.
      requestAnimationFrame(() => {
        const errEl = document.querySelector('[data-slot="form-message"], .text-destructive')
        if (errEl) errEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  // Snap to top whenever the active step changes. Done in an effect (rather
  // than inside goNext) so it runs after React commits the new step's DOM.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [step])

  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (logo) URL.revokeObjectURL(logo.preview)
    setLogo({ file, preview: URL.createObjectURL(file) })
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  function removeLogo() {
    if (logo) {
      URL.revokeObjectURL(logo.preview)
      setLogo(null)
    }
    setExistingLogoUrl(null)
  }

  function removeExistingPhoto(url: string) {
    setExistingPhotoUrls((prev) => prev.filter((u) => u !== url))
    setCoverSelection((prev) => (prev === url ? null : prev))
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const remaining = 5 - photos.length - existingPhotoUrls.length
    const toAdd = files.slice(0, remaining)

    const newPhotos = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPhotos((prev) => [...prev, ...newPhotos])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const removed = prev[index]
      if (removed) URL.revokeObjectURL(removed.preview)
      setCoverSelection((cur) => (cur === removed?.preview ? null : cur))
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    const remaining = 5 - photos.length - existingPhotoUrls.length
    const toAdd = files.slice(0, remaining)
    const newPhotos = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPhotos((prev) => [...prev, ...newPhotos])
  }, [photos.length, existingPhotoUrls.length])

  async function uploadLogoToStorage(): Promise<string | null> {
    if (!logo) return null
    try {
      const ext = logo.file.name.split('.').pop() || 'jpg'
      const path = `logos/${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('business-photos')
        .upload(path, logo.file, { contentType: logo.file.type })
      if (error) {
        toast.error('Logo upload failed. Your listing will be saved without a logo.')
        return null
      }
      const { data: urlData } = supabase.storage
        .from('business-photos')
        .getPublicUrl(path)
      return urlData.publicUrl
    } catch {
      toast.error('Logo upload failed. Your listing will be saved without a logo.')
      return null
    }
  }

  async function uploadPhotosToStorage(): Promise<Array<{ preview: string; url: string }>> {
    if (photos.length === 0) return []
    setUploadingPhotos(true)
    const result: Array<{ preview: string; url: string }> = []
    const timestamp = Date.now()

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      const ext = photo.file.name.split('.').pop() || 'jpg'
      const path = `listings/${timestamp}-${i}.${ext}`

      const { error } = await supabase.storage
        .from('business-photos')
        .upload(path, photo.file, { contentType: photo.file.type })

      if (!error) {
        const { data: urlData } = supabase.storage
          .from('business-photos')
          .getPublicUrl(path)
        result.push({ preview: photo.preview, url: urlData.publicUrl })
      }
    }
    setUploadingPhotos(false)
    return result
  }

  async function handleSubmit(data: ListingFormData) {
    setSubmitting(true)
    try {
      const [newPhotoUploads, newLogoUrl] = await Promise.all([
        uploadPhotosToStorage(),
        uploadLogoToStorage(),
      ])
      const newPhotoUrls = newPhotoUploads.map((p) => p.url)
      const finalPhotoUrls = [...existingPhotoUrls, ...newPhotoUrls]
      const finalLogoUrl = newLogoUrl ?? existingLogoUrl

      // Resolve the user's chosen hero image (cover) to a real URL.
      // - If they picked an existing photo, it's already a URL.
      // - If they picked a newly-uploaded photo, look it up by preview blob.
      // - Fallback: first item in finalPhotoUrls.
      const resolveCover = (): string | null => {
        if (!coverSelection) return finalPhotoUrls[0] || null
        if (existingPhotoUrls.includes(coverSelection)) return coverSelection
        const match = newPhotoUploads.find((p) => p.preview === coverSelection)
        return match?.url || finalPhotoUrls[0] || null
      }
      const coverUrl = resolveCover()

      // Anonymous users: save state and redirect to sign in.
      // The listing isn't persisted yet — sign-in unlocks publishing
      // and lets them manage the listing afterwards.
      if (!user && !isEditMode) {
        localStorage.setItem(
          'listmio_pending_listing',
          JSON.stringify({
            data,
            photoUrls: finalPhotoUrls,
            logoUrl: finalLogoUrl,
            openingHours: hasAnyOpenDay(openingHours) ? openingHours : null,
          }),
        )
        toast.info('Sign in to publish — your details are saved.', {
          description: 'Signing in lets you manage and update your listing later.',
          duration: 5000,
        })
        setSubmitting(false)
        navigate('/signin?returnTo=/list')
        return
      }

      const addr = (data.location || '').trim()
      const cty = (data.city || '').trim()
      const combinedLocation =
        addr && cty ? `${addr}, ${cty}` : addr || cty || data.postcode

      const cleanedServices = (data.services || [])
        .map((s) => ({
          title: (s.title || '').trim(),
          description: (s.description || '').trim() || undefined,
          price: (s.price || '').trim() || undefined,
        }))
        .filter((s) => s.title)

      const basePayload = {
        name: data.name,
        categories: data.categories,
        tagline: data.tagline || null,
        description: data.description,
        location: combinedLocation,
        postcode: data.postcode,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        is_women_owned: data.is_women_owned,
        is_home_based: data.is_home_based,
        is_startup: data.is_startup,
        social_instagram: data.social_instagram || null,
        social_tiktok: data.social_tiktok || null,
        social_linkedin: data.social_linkedin || null,
        social_facebook: data.social_facebook || null,
        services: cleanedServices,
        opening_hours: hasAnyOpenDay(openingHours) ? openingHours : null,
        photos: finalPhotoUrls,
        image_url: coverUrl,
        logo_url: finalLogoUrl,
      }

      if (isEditMode && editId) {
        const slug = await generateUniqueSlug(data.name, editId)
        const { error } = await supabase
          .from('businesses')
          .update({ ...basePayload, slug, updated_at: new Date().toISOString() } as any)
          .eq('id', editId)
        if (error) throw error
        toast.success('Listing updated.')
        setTimeout(() => navigate('/dashboard'), 600)
      } else {
        const slug = await generateUniqueSlug(data.name)
        const insertPayload = {
          ...basePayload,
          slug,
          owner_id: user!.id,
          // Admins publish straight to live; everyone else goes through review.
          status: (isAdmin ? 'live' : 'pending') as 'live' | 'pending',
        }
        const { data: business, error } = await supabase
          .from('businesses')
          .insert(insertPayload as any)
          .select('id, slug')
          .single()
        if (error) throw error
        if (isAdmin) {
          toast.success('Your business has been published!')
          setTimeout(() => navigate(`/business/${business.slug || business.id}`), 600)
        } else {
          toast.success("Submitted! We'll review it shortly and let you know.")
          setTimeout(() => navigate('/dashboard'), 600)
        }
      }
    } catch (err: any) {
      console.error(isEditMode ? 'Error updating listing:' : 'Error creating listing:', err)
      toast.error(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || editLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  // Edit mode requires auth; create mode is open until publish.
  if (!user && isEditMode) {
    return <Navigate to={`/signin?returnTo=${encodeURIComponent(`/dashboard/edit/${editId}`)}`} replace />
  }

  if (editNotFound) {
    return (
      <div className="min-h-screen py-16 px-4 text-center">
        <h1 className="text-2xl font-medium mb-3">Listing not found</h1>
        <p className="text-muted-foreground mb-6">
          This listing doesn't exist or you don't have permission to edit it.
        </p>
        <Button onClick={() => navigate('/dashboard')} className="rounded-full">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const visibleCategories = showAllCategories ? CATEGORIES : TOP_CATEGORIES

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="mx-auto max-w-[640px]">
        <div className="text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-medium tracking-tight mb-2"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            {isEditMode ? 'Edit your listing' : 'List Your Business'}
          </h1>
          {isEditMode && (
            <p className="text-muted-foreground">
              Update your details below and save your changes.
            </p>
          )}
        </div>

        <Stepper
          step={step}
          onStepClick={(i) => {
            if (i < step) setStep(i)
          }}
        />

        <Card className="rounded-2xl shadow-sm mt-6">
          <CardContent className="p-6 sm:p-12">
            <form
              onSubmit={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                  e.preventDefault()
                }
              }}
            >
              <div
                className="transition-all duration-200 ease-in-out"
                key={step}
                style={{ animation: 'fadeSlideIn 200ms ease-in-out' }}
              >
                {step === 0 && (
                  <StepBasics
                    form={form}
                    selectedCategories={selectedCategories}
                    visibleCategories={visibleCategories}
                    showAllCategories={showAllCategories}
                    onToggleAllCategories={() => setShowAllCategories((v) => !v)}
                    logo={logo}
                    existingLogoUrl={existingLogoUrl}
                    onLogoSelect={handleLogoSelect}
                    onLogoRemove={removeLogo}
                    logoInputRef={logoInputRef}
                    servicesField={servicesField}
                  />
                )}
                {step === 1 && (
                  <StepContact
                    form={form}
                    openingHours={openingHours}
                    onDayOpen={setDayOpen}
                    onDayTime={setDayTime}
                  />
                )}
                {step === 2 && (
                  <StepDetails
                    form={form}
                    photos={photos}
                    existingPhotoUrls={existingPhotoUrls}
                    coverSelection={coverSelection}
                    onSetCover={setCoverSelection}
                    onPhotoSelect={handlePhotoSelect}
                    onPhotoDrop={handleDrop}
                    onPhotoRemove={removePhoto}
                    onExistingPhotoRemove={removeExistingPhoto}
                    fileInputRef={fileInputRef}
                  />
                )}
              </div>

              <div className="flex gap-3 pt-6 mt-6 border-t">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    className="rounded-full h-11"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                <div className="flex-1" />
                {isEditMode && step < 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={form.handleSubmit(handleSubmit)}
                    disabled={submitting || uploadingPhotos}
                    className="rounded-full h-11 min-w-[140px]"
                  >
                    {submitting || uploadingPhotos ? (
                      <Spinner className="size-4" />
                    ) : (
                      'Save changes'
                    )}
                  </Button>
                )}
                {step < 2 ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    className="rounded-full h-11 min-w-[120px]"
                  >
                    Next
                    <ArrowRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(handleSubmit)}
                    disabled={submitting || uploadingPhotos}
                    className="rounded-full h-11 min-w-[160px]"
                  >
                    {submitting || uploadingPhotos ? (
                      <Spinner className="size-4" />
                    ) : (
                      isEditMode ? 'Save changes' : 'Publish my listing'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Stepper({
  step,
  onStepClick,
}: {
  step: number
  onStepClick: (i: number) => void
}) {
  const progressPct = STEPS.length > 1 ? (step / (STEPS.length - 1)) * 100 : 0

  return (
    <div className="relative px-5">
      {/* Continuous track behind the steps */}
      <div className="absolute left-5 right-5 top-5 h-1 rounded-full bg-border/70 overflow-hidden" aria-hidden="true">
        <div
          className="h-full bg-primary rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="relative flex items-start justify-between">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const isActive = i === step
          const isCompleted = i < step
          const isClickable = i <= step
          return (
            <div key={i} className="flex flex-col items-center gap-2.5">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(i)}
                disabled={!isClickable}
                className={`relative z-10 size-10 rounded-full flex items-center justify-center transition-all duration-300 ease-out ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground shadow-sm hover:scale-105 cursor-pointer'
                    : isActive
                      ? 'bg-primary text-primary-foreground shadow-md ring-4 ring-primary/15 scale-105'
                      : 'bg-card border-2 border-border text-muted-foreground'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check className="size-4" strokeWidth={2.5} />
                ) : (
                  <Icon className="size-4" />
                )}
              </button>
              <span
                className={`text-xs tracking-wide whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-foreground font-semibold'
                    : isCompleted
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StepBasics({
  form,
  selectedCategories,
  visibleCategories,
  showAllCategories,
  onToggleAllCategories,
  logo,
  existingLogoUrl,
  onLogoSelect,
  onLogoRemove,
  logoInputRef,
  servicesField,
}: {
  form: ReturnType<typeof useForm<ListingFormData>>
  selectedCategories: string[]
  visibleCategories: readonly string[]
  showAllCategories: boolean
  onToggleAllCategories: () => void
  logo: { file: File; preview: string } | null
  existingLogoUrl: string | null
  onLogoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onLogoRemove: () => void
  logoInputRef: React.RefObject<HTMLInputElement | null>
  servicesField: ReturnType<typeof useFieldArray<ListingFormData, 'services'>>
}) {
  const logoPreviewSrc = logo?.preview ?? existingLogoUrl
  const logoLabel = logo?.file.name ?? (existingLogoUrl ? 'Current logo' : null)
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Business name *
        </Label>
        <Input
          id="name"
          placeholder="Your business name"
          className="h-12"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Logo
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </Label>
        <div className="flex items-center gap-4">
          {logoPreviewSrc ? (
            <div className="relative group">
              <img
                src={logoPreviewSrc}
                alt="Business logo"
                className="size-20 rounded-full object-cover border-2 border-border shadow-sm"
              />
              <button
                type="button"
                onClick={onLogoRemove}
                className="absolute -top-1 -right-1 size-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="size-20 rounded-full border-2 border-dashed border-primary/40 bg-primary/[0.03] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/60 transition-colors"
            >
              <ImagePlus className="size-5 text-primary/60" strokeWidth={1.5} />
            </button>
          )}
          <div className="text-sm">
            <p className="text-muted-foreground">
              {logoLabel ?? 'Upload your business logo'}
            </p>
            {logoPreviewSrc ? (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="text-primary text-xs font-medium hover:text-primary/80 transition-colors"
              >
                Replace
              </button>
            ) : (
              <p className="text-xs text-muted-foreground mt-0.5">
                Square image, JPG or PNG, up to 5MB
              </p>
            )}
          </div>
        </div>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onLogoSelect}
          className="hidden"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">
            Categories *
          </Label>
          <span className={`text-xs font-medium tabular-nums ${selectedCategories.length === 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            {selectedCategories.length}/3 selected
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visibleCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || DEFAULT_CATEGORY_ICON
            const isSelected = selectedCategories.includes(cat)
            const isDisabled = !isSelected && selectedCategories.length >= 3
            return (
              <button
                key={cat}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  const current = selectedCategories
                  const next = isSelected
                    ? current.filter((c) => c !== cat)
                    : [...current, cat]
                  form.setValue('categories', next, { shouldValidate: true })
                }}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-150 cursor-pointer
                  h-[100px] sm:h-[120px]
                  ${isSelected
                    ? 'border-primary bg-primary/5'
                    : isDisabled
                      ? 'border-border bg-muted/40 opacity-40 cursor-not-allowed'
                      : 'border-border bg-card hover:border-primary/40'
                  }
                `}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 size-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />
                  </span>
                )}
                <Icon className="size-8 sm:size-10 text-primary [stroke-width:1.5]" />
                <span className="text-xs font-medium text-center leading-tight">
                  {cat}
                </span>
              </button>
            )
          })}
        </div>
        {!showAllCategories && (
          <button
            type="button"
            onClick={onToggleAllCategories}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Show all categories
          </button>
        )}
        {showAllCategories && CATEGORIES.length > 6 && (
          <button
            type="button"
            onClick={onToggleAllCategories}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Show fewer categories
          </button>
        )}
        {form.formState.errors.categories && (
          <p className="text-sm text-destructive">
            {form.formState.errors.categories.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tagline" className="text-sm font-medium text-foreground">
          Tagline
        </Label>
        <Input
          id="tagline"
          placeholder="A short, catchy description"
          className="h-12"
          {...form.register('tagline')}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm font-medium text-foreground">
          Description *
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your business, products, or services"
          rows={5}
          {...form.register('description')}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {/* Services / menu */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium text-foreground">
            Services or menu <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            List what you offer — each one with an optional price.
          </p>
        </div>

        {servicesField.fields.length > 0 && (
          <div className="space-y-3">
            {servicesField.fields.map((field, index) => (
              <div key={field.id} className="bg-muted/40 border border-border rounded-xl p-3 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-2 items-start">
                  <Input
                    placeholder="Service title (e.g. Birthday cake)"
                    className="h-10"
                    {...form.register(`services.${index}.title` as const)}
                  />
                  <Input
                    placeholder="Price (e.g. from £45)"
                    className="h-10"
                    {...form.register(`services.${index}.price` as const)}
                  />
                  <button
                    type="button"
                    onClick={() => servicesField.remove(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-md hover:bg-destructive/10"
                    aria-label="Remove service"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <Textarea
                  placeholder="Short description (optional)"
                  rows={2}
                  className="text-sm"
                  {...form.register(`services.${index}.description` as const)}
                />
                {form.formState.errors.services?.[index]?.title && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.services[index]?.title?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {servicesField.fields.length < 20 && (
          <button
            type="button"
            onClick={() =>
              servicesField.append({ title: '', description: '', price: '' })
            }
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-2"
          >
            + Add a service
          </button>
        )}
      </div>
    </div>
  )
}

function StepContact({
  form,
  openingHours,
  onDayOpen,
  onDayTime,
}: {
  form: ReturnType<typeof useForm<ListingFormData>>
  openingHours: OpeningHours
  onDayOpen: (day: string, open: boolean) => void
  onDayTime: (day: string, field: 'start' | 'end', value: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground inline-flex items-center gap-2">
          <Share2 className="size-4 text-primary" />
          Social media <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <div className="grid sm:grid-cols-2 gap-3">
          <SocialInput
            icon={<InstagramIcon className="size-4" />}
            placeholder="https://instagram.com/…"
            register={form.register('social_instagram')}
          />
          <SocialInput
            icon={<TikTokIcon className="size-4" />}
            placeholder="https://tiktok.com/@…"
            register={form.register('social_tiktok')}
          />
          <SocialInput
            icon={<LinkedinIcon className="size-4" />}
            placeholder="https://linkedin.com/in/…"
            register={form.register('social_linkedin')}
          />
          <SocialInput
            icon={<FacebookIcon className="size-4" />}
            placeholder="https://facebook.com/…"
            register={form.register('social_facebook')}
          />
        </div>
        {(form.formState.errors.social_instagram ||
          form.formState.errors.social_tiktok ||
          form.formState.errors.social_linkedin ||
          form.formState.errors.social_facebook) && (
          <p className="text-sm text-destructive">
            One of the social links isn’t a valid URL. Include https:// at the start.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="website" className="text-sm font-medium text-foreground">
          Website
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </Label>
        <Input
          id="website"
          type="url"
          placeholder="https://yourbusiness.com"
          className="h-12"
          {...form.register('website')}
        />
        {form.formState.errors.website && (
          <p className="text-sm text-destructive">
            {form.formState.errors.website.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="h-12"
          {...form.register('email')}
        />
        <p className="text-xs text-muted-foreground">
          Add it if you'd like customers to enquire by email.
        </p>
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
          Phone
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Phone number"
          className="h-12"
          {...form.register('phone')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-sm font-medium text-foreground">
            City <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="city"
            placeholder="City or town"
            className="h-12"
            {...form.register('city')}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="postcode" className="text-sm font-medium text-foreground">
            Postcode *
          </Label>
          <Input
            id="postcode"
            placeholder="Postcode"
            className="h-12"
            {...form.register('postcode')}
          />
          {form.formState.errors.postcode && (
            <p className="text-sm text-destructive">
              {form.formState.errors.postcode.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location" className="text-sm font-medium text-foreground">
          Address <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="location"
          placeholder="Street address"
          className="h-12"
          {...form.register('location')}
        />
      </div>

      {/* Opening hours */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium text-foreground">
            Opening hours <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Toggle a day on to set its hours.
          </p>
        </div>
        <div className="bg-muted/40 border border-border rounded-xl divide-y divide-border">
          {DAYS_OF_WEEK.map((day) => {
            const d = openingHours[day]
            return (
              <div key={day} className="flex items-center gap-3 px-3 py-2.5">
                <span className="w-20 text-sm font-medium shrink-0">{day.slice(0, 3)}</span>
                <Switch
                  checked={d?.open ?? false}
                  onCheckedChange={(v) => onDayOpen(day, v)}
                  aria-label={`${day} open`}
                />
                {d?.open ? (
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="time"
                      value={d.start}
                      onChange={(e) => onDayTime(day, 'start', e.target.value)}
                      className="bg-card border border-input rounded-md px-2 py-1 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    />
                    <span className="text-muted-foreground">to</span>
                    <input
                      type="time"
                      value={d.end}
                      onChange={(e) => onDayTime(day, 'end', e.target.value)}
                      className="bg-card border border-input rounded-md px-2 py-1 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Closed</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StepDetails({
  form,
  photos,
  existingPhotoUrls,
  coverSelection,
  onSetCover,
  onPhotoSelect,
  onPhotoDrop,
  onPhotoRemove,
  onExistingPhotoRemove,
  fileInputRef,
}: {
  form: ReturnType<typeof useForm<ListingFormData>>
  photos: { file: File; preview: string }[]
  existingPhotoUrls: string[]
  coverSelection: string | null
  onSetCover: (id: string) => void
  onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPhotoDrop: (e: React.DragEvent) => void
  onPhotoRemove: (index: number) => void
  onExistingPhotoRemove: (url: string) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  const isWomenOwned = form.watch('is_women_owned')
  const isHomeBased = form.watch('is_home_based')
  const isStartup = form.watch('is_startup')
  const totalPhotos = existingPhotoUrls.length + photos.length
  // The first photo is the implicit cover when nothing has been picked yet.
  const effectiveCover =
    coverSelection ?? existingPhotoUrls[0] ?? photos[0]?.preview ?? null

  return (
    <div className="space-y-8">
      {/* Photo Upload */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Camera className="size-4 text-primary" />
          <Label className="text-sm font-medium text-foreground">
            Photos
            <span className="text-muted-foreground font-normal ml-1">
              (up to 5)
            </span>
          </Label>
        </div>

        {totalPhotos > 0 && (
          <>
            <p className="text-xs text-muted-foreground">
              Tap the star on a photo to set it as your cover image — the one shown in search results and at the top of your listing.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {existingPhotoUrls.map((url) => {
                const isCover = effectiveCover === url
                return (
                  <div
                    key={url}
                    className={`relative aspect-square rounded-lg overflow-hidden group transition-all ${
                      isCover ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''
                    }`}
                  >
                    <img
                      src={url}
                      alt="Existing photo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onSetCover(url)}
                      aria-label={isCover ? 'Cover photo' : 'Set as cover photo'}
                      className={`absolute top-1 left-1 size-6 rounded-full flex items-center justify-center transition-opacity ${
                        isCover
                          ? 'bg-primary text-primary-foreground opacity-100'
                          : 'bg-foreground/70 text-background opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Star
                        className="size-3.5"
                        fill={isCover ? 'currentColor' : 'none'}
                        strokeWidth={isCover ? 0 : 2}
                      />
                    </button>
                    {isCover && (
                      <span className="absolute bottom-1 left-1 right-1 bg-primary text-primary-foreground text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded text-center">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onExistingPhotoRemove(url)}
                      className="absolute top-1 right-1 size-6 rounded-full bg-foreground/70 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )
              })}
              {photos.map((photo, i) => {
                const isCover = effectiveCover === photo.preview
                return (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-lg overflow-hidden group transition-all ${
                      isCover ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''
                    }`}
                  >
                    <img
                      src={photo.preview}
                      alt={`Upload ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onSetCover(photo.preview)}
                      aria-label={isCover ? 'Cover photo' : 'Set as cover photo'}
                      className={`absolute top-1 left-1 size-6 rounded-full flex items-center justify-center transition-opacity ${
                        isCover
                          ? 'bg-primary text-primary-foreground opacity-100'
                          : 'bg-foreground/70 text-background opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Star
                        className="size-3.5"
                        fill={isCover ? 'currentColor' : 'none'}
                        strokeWidth={isCover ? 0 : 2}
                      />
                    </button>
                    {isCover && (
                      <span className="absolute bottom-1 left-1 right-1 bg-primary text-primary-foreground text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded text-center">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onPhotoRemove(i)}
                      className="absolute top-1 right-1 size-6 rounded-full bg-foreground/70 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {totalPhotos < 5 && (
          <div
            onDrop={onPhotoDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 h-[200px] rounded-xl border-2 border-dashed border-primary/40 bg-primary/[0.03] cursor-pointer hover:border-primary/60 transition-colors"
          >
            <Upload className="size-8 text-primary/60" strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Drop photos here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WebP up to 5MB each
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={onPhotoSelect}
          className="hidden"
        />
      </div>

      {/* Women-led Toggle */}
      <div
        className={`rounded-xl border p-4 transition-colors duration-200 ${
          isWomenOwned ? 'bg-amber/30 border-amber' : 'bg-card border-border'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles
              className={`size-5 ${
                isWomenOwned ? 'text-amber-foreground' : 'text-muted-foreground'
              }`}
            />
            <div>
              <p className="text-sm font-medium">Is your business women-led?</p>
              <p className="text-xs text-muted-foreground">
                Get a special badge on your listing
              </p>
            </div>
          </div>
          <Switch
            checked={isWomenOwned}
            onCheckedChange={(checked) =>
              form.setValue('is_women_owned', checked)
            }
          />
        </div>
        {isWomenOwned && (
          <div className="mt-3 pt-3 border-t border-amber/50">
            <Badge className="bg-amber text-amber-foreground hover:bg-amber">
              <Sparkles className="size-3 mr-1" />
              Women-led
            </Badge>
          </div>
        )}
      </div>

      {/* Home-based Toggle */}
      <div
        className={`rounded-xl border p-4 transition-colors duration-200 ${
          isHomeBased ? 'bg-muted border-primary/30' : 'bg-card border-border'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home
              className={`size-5 ${
                isHomeBased ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            <div>
              <p className="text-sm font-medium">Is this a home-based business?</p>
              <p className="text-xs text-muted-foreground">
                Let customers know you operate from home
              </p>
            </div>
          </div>
          <Switch
            checked={isHomeBased}
            onCheckedChange={(checked) =>
              form.setValue('is_home_based', checked)
            }
          />
        </div>
      </div>

      {/* Startup Toggle */}
      <div
        className={`rounded-xl border p-4 transition-colors duration-200 ${
          isStartup ? 'bg-muted border-primary/30' : 'bg-card border-border'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket
              className={`size-5 ${
                isStartup ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            <div>
              <p className="text-sm font-medium">Is this a startup?</p>
              <p className="text-xs text-muted-foreground">
                Show that you're an emerging business
              </p>
            </div>
          </div>
          <Switch
            checked={isStartup}
            onCheckedChange={(checked) =>
              form.setValue('is_startup', checked)
            }
          />
        </div>
      </div>
    </div>
  )
}