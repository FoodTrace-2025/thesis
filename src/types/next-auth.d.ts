// NextAuth.js Type Augmentation
// Story 2.5: Admin Authentication
// Extends Session and JWT interfaces with custom fields

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      companyId: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    companyId: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    role: string;
    companyId: string | null;
  }
}
