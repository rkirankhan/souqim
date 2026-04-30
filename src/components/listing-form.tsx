import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Field, FieldError } from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { CATEGORIES, CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/lib/constants'
import { Spinner } from '@/components/ui/spinner'
import { Check, Building2, MapPin, Share2, Sparkles, Hop as Home, Rocket, ArrowLeft, ArrowRight, ImagePlus, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

const businessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  owner_name: z.string().optional(),
  categories: z.array(z.string()).min(1, 'Please select at least one category').max(3, 'You can select up to 3 categories'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  tagline: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  postcode: z.string().min(2, 'Postcode is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  logo_url: z.string().optional().or(z.literal('')),
  social_facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  is_women_owned: z.boolean(),
  is_home_based: z.boolean(),
  is_startup: z.boolean(),
})

export type ListingFormData = z.infer<typeof businessSchema>

const STEP_FIELDS: (keyof ListingFormData)[][] = [
  ['name', 'owner_name', 'categories', 'description', 'tagline', 'logo_url'],
  ['location', 'postcode', 'phone', 'email', 'website', 'image_url'],
  ['social_facebook', 'social_twitter', 'social_instagram', 'social_linkedin', 'is_women_owned', 'is_home_based', 'is_startup'],
]

const STEPS = [
  { label: 'Business details', icon: Building2 },
  { label: 'Location & contact', icon: MapPin },
  { label: 'Social & type', icon: Share2 },
]

const DEFAULT_VALUES: ListingFormData = {
  name: '',
  owner_name: '',
  categories: [],
  description: '',
  tagline: '',
  location: '',
  postcode: '',
  phone: '',
  email: '',
  website: '',
  image_url: '',
  logo_url: '',
  social_facebook: '',
  social_twitter: '',
  social_instagram: '',
  social_linkedin: '',
  is_women_owned: false,
  is_home_based: false,
  is_startup: false,
}

interface ListingFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<ListingFormData>
  updatedAt?: string
  submitting: boolean
  onSubmit: (data: ListingFormData) => void
  onCancel: () => void
}

export function ListingForm({ mode, defaultValues, updatedAt, submitting, onSubmit, onCancel }: ListingFormProps) {
  const [step, setStep] = useState(0)

  const form = useForm<ListingFormData>({
    resolver: zodResolver(businessSchema),
    mode: 'onChange',
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues,
      owner_name: defaultValues?.owner_name ?? '',
      categories: defaultValues?.categories ?? [],
      tagline: defaultValues?.tagline ?? '',
      phone: defaultValues?.phone ?? '',
      email: defaultValues?.email ?? '',
      website: defaultValues?.website ?? '',
      image_url: defaultValues?.image_url ?? '',
      logo_url: defaultValues?.logo_url ?? '',
      social_facebook: defaultValues?.social_facebook ?? '',
      social_twitter: defaultValues?.social_twitter ?? '',
      social_instagram: defaultValues?.social_instagram ?? '',
      social_linkedin: defaultValues?.social_linkedin ?? '',
    },
  })

  async function goNext() {
    const fields = STEP_FIELDS[step]
    const valid = await form.trigger(fields)
    if (valid) setStep((s) => Math.min(s + 1, 2))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 mb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const isActive = i === step
          const isCompleted = i < step
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div className={`flex-1 h-px ${isCompleted || isActive ? 'bg-primary' : 'bg-border'}`} />
                )}
                <button
                  type="button"
                  onClick={() => { if (isCompleted) setStep(i) }}
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                        ? 'bg-primary/15 text-primary cursor-pointer'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="size-4" /> : <Icon className="size-4" />}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
              <span className={`text-xs text-center hidden sm:block ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      {mode === 'edit' && updatedAt && (
        <p className="text-xs text-muted-foreground text-center">
          Last updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
        </p>
      )}

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                e.preventDefault()
              }
            }}
          >
            {step === 0 && <StepBusinessDetails form={form} />}
            {step === 1 && <StepLocationContact form={form} />}
            {step === 2 && <StepSocialType form={form} />}

            <div className="flex gap-3 pt-6 mt-6 border-t">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={goBack} className="rounded-full h-11">
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={onCancel} className="rounded-full h-11">
                  Cancel
                </Button>
              )}

              <div className="flex-1" />

              {step < 2 ? (
                <Button type="button" onClick={goNext} className="rounded-full h-11 min-w-[120px]">
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={submitting} className="rounded-full h-11 min-w-[140px]">
                  {submitting ? (
                    <Spinner className="size-4" />
                  ) : mode === 'create' ? (
                    'Publish listing'
                  ) : (
                    'Save changes'
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function StepBusinessDetails({ form }: { form: ReturnType<typeof useForm<ListingFormData>> }) {
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(form.getValues('logo_url') || null)
  const [uploading, setUploading] = useState(false)

  async function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setLogoPreview(preview)
    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `logos/${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('business-photos')
        .upload(path, file, { contentType: file.type })
      if (error) {
        toast.error('Failed to upload logo. Please try again.')
        setLogoPreview(null)
      } else {
        const { data: urlData } = supabase.storage
          .from('business-photos')
          .getPublicUrl(path)
        form.setValue('logo_url', urlData.publicUrl, { shouldDirty: true })
      }
    } catch {
      toast.error('Failed to upload logo. Please try again.')
      setLogoPreview(null)
    }
    setUploading(false)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  function removeLogo() {
    if (logoPreview) URL.revokeObjectURL(logoPreview)
    setLogoPreview(null)
    form.setValue('logo_url', '', { shouldDirty: true })
  }

  return (
    <div className="space-y-5">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Label htmlFor={field.name}>Business Name *</Label>
            <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Your Business Name" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Logo Upload */}
      <Field>
        <Label>Logo <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <div className="flex items-center gap-4 pt-1">
          {logoPreview ? (
            <div className="relative group">
              <img
                src={logoPreview}
                alt="Business logo"
                className="size-20 rounded-full object-cover border-2 border-border shadow-sm"
              />
              <button
                type="button"
                onClick={removeLogo}
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
            {uploading ? (
              <p className="text-muted-foreground">Uploading...</p>
            ) : logoPreview ? (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="text-primary text-xs font-medium hover:text-primary/80 transition-colors"
              >
                Replace logo
              </button>
            ) : (
              <p className="text-muted-foreground text-xs">Square image, JPG or PNG, up to 5MB</p>
            )}
          </div>
        </div>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleLogoFile}
          className="hidden"
        />
      </Field>
      <Controller
        name="owner_name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Label htmlFor={field.name}>Owner Name (Optional)</Label>
            <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Your Name" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="categories"
        control={form.control}
        render={({ field, fieldState }) => {
          const selected: string[] = field.value ?? []
          return (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <Label>Categories *</Label>
                <span className={`text-xs font-medium tabular-nums ${selected.length === 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {selected.length}/3 selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat] || DEFAULT_CATEGORY_ICON
                  const isSelected = selected.includes(cat)
                  const isDisabled = !isSelected && selected.length >= 3
                  return (
                    <button
                      key={cat}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        const next = isSelected
                          ? selected.filter((c) => c !== cat)
                          : [...selected, cat]
                        field.onChange(next)
                      }}
                      className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-150 cursor-pointer h-[90px]
                        ${isSelected
                          ? 'border-primary bg-primary/5'
                          : isDisabled
                            ? 'border-border bg-muted/40 opacity-40 cursor-not-allowed'
                            : 'border-border bg-card hover:border-primary/40'
                        }`}
                    >
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 size-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />
                        </span>
                      )}
                      <Icon className="size-6 text-primary [stroke-width:1.5]" />
                      <span className="text-xs font-medium text-center leading-tight">{cat}</span>
                    </button>
                  )
                })}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )
        }}
      />
      <Controller
        name="tagline"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Label htmlFor={field.name}>Tagline (Optional)</Label>
            <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="A short, catchy description" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Label htmlFor={field.name}>Description *</Label>
            <Textarea {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Describe your business, products, or services" rows={5} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  )
}

function StepLocationContact({ form }: { form: ReturnType<typeof useForm<ListingFormData>> }) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor={field.name}>Location *</Label>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="City or Town" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="postcode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor={field.name}>Postcode *</Label>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Postcode" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor={field.name}>Phone (Optional)</Label>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Phone Number" type="tel" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label htmlFor={field.name}>Email (Optional)</Label>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="contact@business.com" type="email" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="website"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Label htmlFor={field.name}>Website (Optional)</Label>
            <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="https://yourbusiness.com" type="url" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="image_url"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Label htmlFor={field.name}>Business Image URL (Optional)</Label>
            <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="https://example.com/image.jpg" type="url" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  )
}

function StepSocialType({ form }: { form: ReturnType<typeof useForm<ListingFormData>> }) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base inline-flex items-center gap-2 mb-4">
          <Share2 className="size-4 text-primary" />
          Social Media (Optional)
        </Label>
        <div className="grid sm:grid-cols-2 gap-4">
          <Controller
            name="social_facebook"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Facebook</Label>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="https://facebook.com/..." type="url" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="social_twitter"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Twitter/X</Label>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="https://twitter.com/..." type="url" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="social_instagram"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Instagram</Label>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="https://instagram.com/..." type="url" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="social_linkedin"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>LinkedIn</Label>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="https://linkedin.com/..." type="url" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Business type</Label>
        <div className="space-y-3">
          <Controller
            name="is_women_owned"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id={field.name} checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor={field.name} className="cursor-pointer font-normal inline-flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-amber-foreground" />
                  This is a women-led business
                </Label>
              </div>
            )}
          />
          <Controller
            name="is_home_based"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id={field.name} checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor={field.name} className="cursor-pointer font-normal inline-flex items-center gap-1.5">
                  <Home className="size-3.5 text-muted-foreground" />
                  Home-based business
                </Label>
              </div>
            )}
          />
          <Controller
            name="is_startup"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id={field.name} checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor={field.name} className="cursor-pointer font-normal inline-flex items-center gap-1.5">
                  <Rocket className="size-3.5 text-muted-foreground" />
                  Startup
                </Label>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}
