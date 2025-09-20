import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const newPassword = process.argv[2] || 'Strong!Pass123'
  const hashed = await bcrypt.hash(newPassword, 12)

  const user = await prisma.user.updateMany({
    where: { email: 'admin@example.com' },
    data: { password: hashed }
  })

  if (user.count === 0) {
    console.log('No admin user found with email admin@example.com')
  } else {
    console.log(`Admin password updated to: ${newPassword}`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
