import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Тестовые пользователи с разными ролями
  const testUsers = [
    {
      email: 'admin@smartcourse.ru',
      password: 'admin123',
      fullName: 'Системный администратор',
      role: 'ADMIN',
    },
    {
      email: 'curator@smartcourse.ru',
      password: 'curator123',
      fullName: 'Куратор курсов',
      role: 'CURATOR',
    },
    {
      email: 'manager@smartcourse.ru',
      password: 'manager123',
      fullName: 'Менеджер',
      role: 'MANAGER',
    },
    {
      email: 'client@smartcourse.ru',
      password: 'client123',
      fullName: 'Клиент компании',
      role: 'CLIENT',
    },
    {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Тестовый кандидат',
      role: 'CANDIDATE',
    },
  ];

  for (const userData of testUsers) {
    // Проверяем, существует ли уже пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      console.log(`✅ User ${userData.email} already exists`);
      continue;
    }

    // Создаем пользователя
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        fullName: userData.fullName,
        role: userData.role,
      },
    });

    console.log('✅ User created:', {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });