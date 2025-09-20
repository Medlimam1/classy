import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

type ProductLike = {
  id: string
  name: string
  slug: string
  published: boolean
  price: { toString(): string }
}

async function main(){
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      published: true,
      price: true
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log('products:', products.map((p: ProductLike) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    published: p.published,
    price: p.price.toString()
  })))

  await prisma.$disconnect()
}

main().catch(e=>{
  console.error(e)
  process.exit(1)
})
