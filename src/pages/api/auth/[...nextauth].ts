// NextAuth.js Configuration
// Story 2.5: Admin Authentication
// Handles email/password authentication with JWT sessions

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // 1. Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 2. Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { company: true },
        });

        if (!user) {
          return null;
        }

        // 3. Verify password with bcrypt
        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        // 4. Check company status for non-PLATFORM_ADMIN users
        // PLATFORM_ADMIN has no company, skip company check
        if (user.role !== 'PLATFORM_ADMIN') {
          if (!user.company || user.company.status !== 'APPROVED') {
            throw new Error('Company not approved');
          }
        }

        // 5. Return user data for JWT token
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in - add user data to token
      if (user) {
        token.userId = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose token data to client session
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.companyId = token.companyId as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Custom login page (Epic 7)
    error: '/login', // Redirect errors to login
  },
};

export default NextAuth(authOptions);
