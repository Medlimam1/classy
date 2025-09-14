import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { prisma } from '@/lib/prisma'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductReviews from '@/components/product/ProductReviews'
import RelatedProducts from '@/components/product/RelatedProducts'

interface ProductPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
      published: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        }
      },
      variants: {
        orderBy: {
          createdAt: 'asc',
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        }
      }
    }
  })

  if (!product) {
    notFound()
  }

  // Fetch related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      published: true,
      id: {
        not: product.id,
      }
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        }
      }
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 rtl:space-x-reverse md:space-x-3">
          <li className="inline-flex items-center">
            <a href={`/${params.locale}`} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-amber-600">
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <a href={`/${params.locale}/shop?category=${product.category.slug}`} className="ml-1 rtl:ml-0 rtl:mr-1 text-sm font-medium text-gray-700 hover:text-amber-600 md:ml-2 rtl:md:ml-0 rtl:md:mr-2">
                {product.category.name}
              </a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ml-1 rtl:ml-0 rtl:mr-1 text-sm font-medium text-gray-500 md:ml-2 rtl:md:ml-0 rtl:md:mr-2">
                {product.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Product Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 rtl:space-x-reverse">
              <button className="border-amber-600 text-amber-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Description
              </button>
            </nav>
          </div>
          <div className="mt-8">
            <div className="prose prose-sm max-w-none text-gray-500">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-16">
        <ProductReviews reviews={product.reviews} productId={product.id} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  )
}