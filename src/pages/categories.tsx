import { CategoryCard } from '@/components/category-card'
import { CATEGORIES } from '@/lib/constants'

export function CategoriesPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Categories
          </h1>
          <p className="text-muted-foreground">
            Browse businesses by category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </div>
    </div>
  )
}
