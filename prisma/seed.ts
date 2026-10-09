import { PrismaClient } from '../src/generated/prisma/client.js'

import { getDatabaseUrl } from '../src/database-url.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Contas e perfis nascem do login com o Google: não há dado de exemplo para semear ainda.
  // Os eventos de exemplo continuam em `src/data/` até o cadastro de eventos existir no banco.

  console.log('✅ Nada para semear por enquanto')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
