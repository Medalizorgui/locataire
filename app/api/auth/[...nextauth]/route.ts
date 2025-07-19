import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { username: credentials.username } });
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user.id.toString(), name: user.username };
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' as const },
  pages: { signIn: '/login' },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 