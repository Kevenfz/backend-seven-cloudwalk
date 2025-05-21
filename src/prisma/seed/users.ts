import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const users: Prisma.UsersCreateInput[] = [
  {
    nickname: 'Jaymeson Mendes',
    email: 'jaymeson@teste.com',
    password: 'Abc1234*',
    accountType: 'PF',
    roleAdmin: true,
    verificationCode: '1',
  },
  {
    nickname: 'Keven Ferreira',
    email: 'keven.ferreira@hotmail.com',
    password: 'Abc1234*',
    accountType: 'PF',
    roleAdmin: true,
    verificationCode: '2',
  },
  {
    nickname: 'Keven Ferreira',
    email: 'kevenferreira76@gmail.com',
    password: 'Abc1234*',
    accountType: 'PF',
    roleAdmin: true,
    verificationCode: '10',
  },
  {
    nickname: 'Elieldo Martins',
    email: 'hefi1413@gmail.com',
    password: 'Abc1234*',
    accountType: 'PF',
    roleAdmin: true,
    verificationCode: '4',
  },
  {
    nickname: 'Karen Lourenço',
    email: 'karenmascarenhaslourenco@gmail.com',
    password: 'Abc1234*',
    accountType: 'PF',
    roleAdmin: true,
    verificationCode: '5',
  },
];

export const user = async (prisma: PrismaClient) => {
  for (const obj of Object.values(users)) {
    await prisma.users.upsert({
      where: { email: obj.email },
      update: {},
      create: {
        ...obj,
        password: await bcrypt.hash(obj.password, 10),
      },
    });
  }
};
