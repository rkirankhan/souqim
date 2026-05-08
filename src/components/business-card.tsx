import { MapPin, Store, Sparkles, Rocket } from 'lucide-react'
import type { Business } from '@/lib/database.types'
import { Link } from 'react-router-dom'
import { CATEGORY_ACCENTS, DEFAULT_CATEGORY_ACCENT } from '@/lib/constants'

interface BusinessCardProps {
  business: Business
  compact?: boolean
}

// "12 Some Street, Bristol" → "Bristol". Falls back to the full string when
// there's no comma (location was already just the city/town).
function cityFromLocation(location: string): string {
  const idx = location.lastIndexOf(',')
  return idx > -1 ? location.slice(idx + 1).trim() || location : location
}

export function BusinessCard({ business, compact = false }: BusinessCardProps) {
  const primaryCat = (business.categories ?? [])[0]
  const accent = (primaryCat && CATEGORY_ACCENTS[primaryCat]) || DEFAULT_CATEGORY_ACCENT

  return (
    <Link to={`/business/${business.slug || business.id}`} className="block">
      <div className="group h-full bg-card border rounded-[14px] overflow-hidden transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.09)] hover:border-[#D1CBC4]">
        <div
          className={`${compact ? 'h-[130px]' : 'h-[150px]'} relative flex items-center justify-center overflow-hidden`}
          style={{
            background: business.image_url
              ? undefined
              : `linear-gradient(135deg, ${accent.grad[0]}, ${accent.grad[1]})`,
          }}
        >
          {business.image_url ? (
            <img src={business.image_url} alt={business.name} className="w-full h-full object-cover" />
          ) : (
            <Store className="size-7" style={{ color: accent.fg }} strokeWidth={1.4} />
          )}
          <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
            {business.is_women_owned && (
              <span className="inline-flex items-center gap-1 bg-amber text-amber-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                <Sparkles className="size-[9px]" />
                Women-led
              </span>
            )}
            {business.is_startup && (
              <span className="inline-flex items-center gap-1 bg-indigo-600 text-white rounded-full px-2 py-0.5 text-[10px] font-medium">
                <Rocket className="size-[9px]" />
                Startup
              </span>
            )}
          </div>
        </div>

        <div className={compact ? 'px-3.5 pt-3 pb-3.5' : 'px-4 pt-3.5 pb-4'}>
          <h3
            className={`font-medium text-foreground leading-snug line-clamp-1 mb-1.5 ${compact ? 'text-[14px]' : 'text-[15px]'}`}
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {business.name}
          </h3>
          {primaryCat && (
            <div>
              <span className="inline-block text-[10.5px] px-1.5 py-0.5 rounded-md bg-[#FAF6F1] text-[color:#5C4E46] mb-2">
                {primaryCat}
              </span>
            </div>
          )}
          <div className="inline-flex items-center gap-1 text-xs text-[#9D8E87]">
            <MapPin className="size-[11px]" />
            {cityFromLocation(business.location)}
          </div>
        </div>
      </div>
    </Link>
  )
}
