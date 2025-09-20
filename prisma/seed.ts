import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  // Ensure an admin exists with the requested email. Use upsert to avoid duplicates.
  const adminPassword = 'Strong!Pass123'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      // Ensure role remains ADMIN if user exists
      role: 'ADMIN',
    },
    create: {
      email: 'admin@example.com',
      name: 'Store Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user ensured:', adminUser.email)

  // Create categories
  const categories = [
    {
      name: 'Suits',
      nameAr: 'البدلات',
      slug: 'suits',
      description: 'Elegant suits for all occasions',
      descriptionAr: 'بدلات أنيقة لجميع المناسبات'
    },
    {
      name: 'Shirts',
      nameAr: 'القمصان',
      slug: 'shirts',
      description: 'Premium quality shirts',
      descriptionAr: 'قمصان عالية الجودة'
    },
    {
      name: 'Pants',
      nameAr: 'البناطيل',
      slug: 'pants',
      description: 'Comfortable and stylish pants',
      descriptionAr: 'بناطيل مريحة وأنيقة'
    },
    {
      name: 'Shoes',
      nameAr: 'الأحذية',
      slug: 'shoes',
      description: 'Quality footwear',
      descriptionAr: 'أحذية عالية الجودة'
    },
    {
      name: 'Accessories',
      nameAr: 'الإكسسوارات',
      slug: 'accessories',
      description: 'Fashion accessories',
      descriptionAr: 'إكسسوارات الموضة'
    }
  ]

  const createdCategories = []
  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    createdCategories.push(createdCategory)
    console.log('✅ Category created:', createdCategory.nameAr)
  }

  // Create sample products
  const products = [
    {
      name: 'Classic Navy Suit',
      nameAr: 'بدلة كلاسيكية زرقاء',
      slug: 'classic-navy-suit',
      description: 'A timeless navy suit perfect for business and formal occasions',
      descriptionAr: 'بدلة زرقاء كلاسيكية مثالية للأعمال والمناسبات الرسمية',
      price: 25000,
      comparePrice: 30000,
      sku: 'SUIT-001',
      categoryId: createdCategories[0].id,
      featured: true,
      published: true,
      status: 'ACTIVE',
      images: ['/images/products/suit-1.jpg']
    },
    {
      name: 'White Dress Shirt',
      nameAr: 'قميص أبيض رسمي',
      slug: 'white-dress-shirt',
      description: 'Premium cotton dress shirt in classic white',
      descriptionAr: 'قميص رسمي من القطن الفاخر باللون الأبيض الكلاسيكي',
      price: 5000,
      comparePrice: 6000,
      sku: 'SHIRT-001',
      categoryId: createdCategories[1].id,
      featured: true,
      published: true,
      status: 'ACTIVE',
      images: ['/images/products/shirt-1.jpg']
    },
    {
      name: 'Black Formal Pants',
      nameAr: 'بنطلون أسود رسمي',
      slug: 'black-formal-pants',
      description: 'Elegant black formal pants with perfect fit',
      descriptionAr: 'بنطلون أسود رسمي أنيق بقصة مثالية',
      price: 8000,
      comparePrice: 10000,
      sku: 'PANTS-001',
      categoryId: createdCategories[2].id,
      featured: true,
      published: true,
      status: 'ACTIVE',
      images: ['/images/products/pants-1.jpg']
    },
    {
      name: 'Leather Oxford Shoes',
      nameAr: 'حذاء جلدي أكسفورد',
      slug: 'leather-oxford-shoes',
      description: 'Handcrafted leather Oxford shoes',
      descriptionAr: 'حذاء أكسفورد جلدي مصنوع يدوياً',
      price: 15000,
      comparePrice: 18000,
      sku: 'SHOES-001',
      categoryId: createdCategories[3].id,
      featured: true,
      published: true,
      status: 'ACTIVE',
      images: ['/images/products/shoes-1.jpg']
    },
    {
      name: 'Silk Tie',
      nameAr: 'ربطة عنق حريرية',
      slug: 'silk-tie',
      description: 'Premium silk tie with elegant pattern',
      descriptionAr: 'ربطة عنق حريرية فاخرة بنقشة أنيقة',
      price: 2500,
      comparePrice: 3000,
      sku: 'TIE-001',
      categoryId: createdCategories[4].id,
      featured: true,
      published: true,
      status: 'ACTIVE',
      images: ['/images/products/tie-1.jpg']
    },
    {
      name: 'Gray Business Suit',
      nameAr: 'بدلة عمل رمادية',
      slug: 'gray-business-suit',
      description: 'Professional gray suit for business meetings',
      descriptionAr: 'بدلة رمادية مهنية لاجتماعات العمل',
      price: 28000,
      comparePrice: 32000,
      sku: 'SUIT-002',
      categoryId: createdCategories[0].id,
      featured: true,
      published: true,
      status: 'ACTIVE',
      images: ['/images/products/suit-2.jpg']
    },
    {
      name: 'Blue Striped Shirt',
      nameAr: 'قميص أزرق مخطط',
      slug: 'blue-striped-shirt',
      description: 'Elegant blue striped dress shirt',
      descriptionAr: 'قميص رسمي أزرق مخطط أنيق',
      price: 5500,
      comparePrice: 7000,
      sku: 'SHIRT-002',
      categoryId: createdCategories[1].id,
      featured: true,
      published: true,
      status: 'ACTIVE',
      images: ['/images/products/shirt-2.jpg']
    },
    {
      name: 'Brown Leather Belt',
      nameAr: 'حزام جلدي بني',
      slug: 'brown-leather-belt',
      description: 'Genuine leather belt in brown',
      descriptionAr: 'حزام من الجلد الطبيعي باللون البني',
      price: 3500,
      comparePrice: 4000,
      sku: 'BELT-001',
      categoryId: createdCategories[4].id,
      featured: true,
      published: true,
      status: 'ACTIVE',
      images: ['/images/products/belt-1.jpg']
    }
  ]

  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
    console.log('✅ Product created:', createdProduct.nameAr)
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })