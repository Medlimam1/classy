import { prisma } from '@/lib/prisma'
import Categories from '@/components/home/Categories'

type Params = { locale: 'en' | 'ar' }

export default async function CategoriesPage({ params }: { params: Params }) {
  // We don't need `locale` inside this page — ensure params resolved for Next runtime.
  await params

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Render Categories component which expects Category[] */}
      <Categories categories={categories} />
    </main>
  )
}
