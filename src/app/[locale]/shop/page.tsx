import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'

interface SearchParams {
  category?: string
  search?: string
  page?: string
}

interface ShopPageProps {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const { category, search, page = '1' } = params
  
  const currentPage = parseInt(page)
  const itemsPerPage = 12
  const skip = (currentPage - 1) * itemsPerPage

  // Build where clause
  const where: any = {
    published: true,
    status: 'ACTIVE'
  }

  if (category) {
    where.category = {
      slug: category
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { nameAr: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { descriptionAr: { contains: search, mode: 'insensitive' } }
    ]
  }

  // Fetch products
  const [productsRaw, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true
      },
      skip,
      take: itemsPerPage,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.product.count({ where })
  ])

  // Convert Decimal to number for client components
  const products = productsRaw.map(product => ({
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    variants: product.variants.map(variant => ({
      ...variant,
      price: Number(variant.price),
      comparePrice: variant.comparePrice ? Number(variant.comparePrice) : null
    }))
  }))

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">المتجر</h1>
        {category && (
          <p className="text-gray-600">تصفية حسب: {category}</p>
        )}
        {search && (
          <p className="text-gray-600">البحث عن: {search}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          عرض {products.length} من أصل {totalCount} منتج
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">لا توجد منتجات</h2>
          <p className="text-gray-600">لم نجد أي منتجات تطابق معايير البحث الخاصة بك.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <a
                  key={pageNum}
                  href={`?${new URLSearchParams({ ...params, page: pageNum.toString() }).toString()}`}
                  className={`px-4 py-2 rounded-md ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}