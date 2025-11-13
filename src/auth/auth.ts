import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../prisma/prisma.service.js';

// const prisma = new PrismaClient();
const prisma = new PrismaService();

export const auth = betterAuth({
  trustedOrigins: [
    'http://localhost:3005',
    'https://kanban-task-backend.vercel.app',
  ],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
