import { PrismaClient } from '@prisma/client';
import { seedRole } from './role.seed';
import { seedPermission } from './permission.seed';

const prisma = new PrismaClient();

async function main() {
  await seedPermission(prisma);
  console.log('[+] Права созданы');

  await seedRole(prisma);
  console.log('[+] Роли созданы');

  console.log('[+] Все готово');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
