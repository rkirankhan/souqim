import { useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
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
  Sparkles, Camera, MapPin, Hop as Home, ImagePlus, Rocket,
} from 'lucide-react'
import { toast } from 'sonner'
import { Navigate, useNavigate } from 'react-router-dom'

const TOP_CATEGORIES = CATEGORIES.slice(0, 6)

const listingSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  categories: z.array(z.string()).min(1, 'Please select at least one category').max(3, 'You can select up to 3 categories'),
  tagline: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postcode: z.string().min(2, 'Postcode is required'),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  is_women_owned: z.boolean(),
  is_home_based: z.boolean(),
  is_startup: z.boolean(),
})

type ListingFormData = z.infer<typeof listingSchema>

const STEP_FIELDS: (keyof ListingFormData)[][] = [
  ['name', 'categories', 'tagline', 'description'],
  ['location', 'city', 'postcode', 'phone', 'email', 'website', 'is_women_owned', 'is_home_based', 'is_startup'],
]

const STEPS = [
  { label: 'Basics', icon: Sparkles },
  { label: 'Contact & details', icon: MapPin },
]

export function ListPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
  const [logo, setLogo] = useState<{ file: File; preview: string } | null>(null)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [showAllCategories, setShowAllCategories] = useState(false)

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
    },
  })

  const selectedCategories = form.watch('categories')

  async function goNext() {
    const fields = STEP_FIELDS[step]
    const valid = await form.trigger(fields)
    if (valid) setStep((s) => Math.min(s + 1, 1))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

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
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const remaining = 5 - photos.length
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
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    const remaining = 5 - photos.length
    const toAdd = files.slice(0, remaining)
    const newPhotos = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPhotos((prev) => [...prev, ...newPhotos])
  }, [photos.length])

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

  async function uploadPhotosToStorage(): Promise<string[]> {
    if (photos.length === 0) return []
    setUploadingPhotos(true)
    const urls: string[] = []
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
        urls.push(urlData.publicUrl)
      }
    }
    setUploadingPhotos(false)
    return urls
  }

  async function handleSubmit(data: ListingFormData) {
    if (!user) return
    setSubmitting(true)
    try {
      const [photoUrls, logoUrl] = await Promise.all([
        uploadPhotosToStorage(),
        uploadLogoToStorage(),
      ])

      const insertPayload = {
        name: data.name,
        categories: data.categories,
        tagline: data.tagline || null,
        description: data.description,
        location: `${data.location}, ${data.city}`,
        postcode: data.postcode,
        phone: data.phone || null,
        email: data.email,
        website: data.website || null,
        is_women_owned: data.is_women_owned,
        is_home_based: data.is_home_based,
        is_startup: data.is_startup,
        photos: photoUrls,
        image_url: photoUrls[0] || null,
        logo_url: logoUrl,
        owner_id: user.id,
        // Admins publish straight to live; everyone else goes through review.
        status: (isAdmin ? 'live' : 'pending') as 'live' | 'pending',
      }

      const { data: business, error } = await supabase
        .from('businesses')
        .insert(insertPayload as any)
        .select('id')
        .single()

      if (error) throw error

      if (isAdmin) {
        toast.success('Your business has been published!')
        setTimeout(() => navigate(`/business/${business.id}`), 600)
      } else {
        toast.success("Submitted! We'll review it shortly and let you know.")
        setTimeout(() => navigate('/dashboard'), 600)
      }
    } catch (err: any) {
      console.error('Error creating listing:', err)
      toast.error(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/signin?returnTo=${encodeURIComponent('/list')}`} replace />
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
            List Your Business
          </h1>
          <p className="text-muted-foreground">
            No account needed to get started. Fill in your details and go live
            in minutes.
          </p>
        </div>

        <Stepper step={step} onStepClick={(i) => { if (i < step) setStep(i) }} />

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
                    onLogoSelect={handleLogoSelect}
                    onLogoRemove={removeLogo}
                    logoInputRef={logoInputRef}
                  />
                )}
                {step === 1 && (
                  <div className="space-y-8">
                    <StepContact form={form} />
                    <StepDetails
                      form={form}
                      photos={photos}
                      onPhotoSelect={handlePhotoSelect}
                      onPhotoDrop={handleDrop}
                      onPhotoRemove={removePhoto}
                      fileInputRef={fileInputRef}
                    />
                  </div>
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
                {step < 1 ? (
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
                      'Publish my listing'
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
  return (
    <div className="flex items-start justify-between gap-0">
      {STEPS.map((s, i) => {
        const isActive = i === step
        const isCompleted = i < step
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center w-full">
              {i > 0 && (
                <div className="flex-1 h-0.5 transition-colors duration-200">
                  <div
                    className={`h-full transition-all duration-200 ${
                      isCompleted || isActive ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => onStepClick(i)}
                disabled={i > step}
                className={`shrink-0 size-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground cursor-pointer'
                    : isActive
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-background text-primary'
                      : 'bg-muted text-muted-foreground cursor-default'
                }`}
              >
                {isCompleted ? (
                  <Check className="size-4" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </button>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 transition-colors duration-200">
                  <div
                    className={`h-full transition-all duration-200 ${
                      isCompleted ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                </div>
              )}
            </div>
            <span
              className={`text-xs text-center ${
                isActive
                  ? 'text-foreground font-medium'
                  : isCompleted
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
              }`}
            >
              {s.label}
            </span>
          </div>
        )
      })}
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
  onLogoSelect,
  onLogoRemove,
  logoInputRef,
}: {
  form: ReturnType<typeof useForm<ListingFormData>>
  selectedCategories: string[]
  visibleCategories: readonly string[]
  showAllCategories: boolean
  onToggleAllCategories: () => void
  logo: { file: File; preview: string } | null
  onLogoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onLogoRemove: () => void
  logoInputRef: React.RefObject<HTMLInputElement | null>
}) {
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
          {logo ? (
            <div className="relative group">
              <img
                src={logo.preview}
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
              {logo ? logo.file.name : 'Upload your business logo'}
            </p>
            {logo ? (
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
    </div>
  )
}

function StepContact({
  form,
}: {
  form: ReturnType<typeof useForm<ListingFormData>>
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="location" className="text-sm font-medium text-foreground">
          Address *
        </Label>
        <Input
          id="location"
          placeholder="Street address"
          className="h-12"
          {...form.register('location')}
        />
        {form.formState.errors.location && (
          <p className="text-sm text-destructive">
            {form.formState.errors.location.message}
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-sm font-medium text-foreground">
            City *
          </Label>
          <Input
            id="city"
            placeholder="City or town"
            className="h-12"
            {...form.register('city')}
          />
          {form.formState.errors.city && (
            <p className="text-sm text-destructive">
              {form.formState.errors.city.message}
            </p>
          )}
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

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="h-12"
          {...form.register('email')}
        />
        <p className="text-xs text-muted-foreground">
          Used for customer enquiries and managing your listing.
        </p>
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
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
    </div>
  )
}

function StepDetails({
  form,
  photos,
  onPhotoSelect,
  onPhotoDrop,
  onPhotoRemove,
  fileInputRef,
}: {
  form: ReturnType<typeof useForm<ListingFormData>>
  photos: { file: File; preview: string }[]
  onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPhotoDrop: (e: React.DragEvent) => void
  onPhotoRemove: (index: number) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  const isWomenOwned = form.watch('is_women_owned')
  const isHomeBased = form.watch('is_home_based')
  const isStartup = form.watch('is_startup')

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

        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                <img
                  src={photo.preview}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onPhotoRemove(i)}
                  className="absolute top-1 right-1 size-6 rounded-full bg-foreground/70 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length < 5 && (
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