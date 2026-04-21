import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/lib/constants'

interface CategoryCardProps {
  category: string
  count?: number
}

export function CategoryCard({ category, count }: CategoryCardProps) {
  const Icon = CATEGORY_ICONS[category] || DEFAULT_CATEGORY_ICON

  return (
    <Link to={`/browse?category=${encodeURIComponent(category)}`}>
      <Card className="group cursor-pointer border transition-all hover:border-primary/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 rounded-lg bg-muted p-3 w-fit">
            <Icon className="size-5 text-secondary" />
          </div>
          <CardTitle className="text-sm font-medium">{category}</CardTitle>
          {count !== undefined && (
            <p className="text-xs text-muted-foreground">{count}</p>
          )}
        </CardHeader>
      </Card>
    </Link>
  )
}
