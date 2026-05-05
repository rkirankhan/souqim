import { supabase } from './supabase'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return UUID_RE.test(value)
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/**
 * Generate a slug for `name` that doesn't collide with any existing
 * business (other than `excludeId`). Appends -2, -3, ... when needed.
 */
export async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || 'business'
  let slug = base
  let suffix = 1
  // Cap iterations to avoid infinite loops in pathological cases.
  for (let i = 0; i < 50; i++) {
    let query = supabase.from('businesses').select('id').eq('slug', slug)
    if (excludeId) query = query.neq('id', excludeId)
    const { data } = await query.maybeSingle()
    if (!data) return slug
    suffix++
    slug = `${base}-${suffix}`
  }
  // Last-resort: random suffix
  return `${base}-${Math.random().toString(36).slice(2, 8)}`
}
