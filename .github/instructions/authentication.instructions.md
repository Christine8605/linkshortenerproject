---
description: Read this before implementing or modifying authentication for this project.
---

# Authentication (Clerk)

This document defines the authentication standards for the Link Shortener project using Clerk. **All authentication must be handled exclusively through Clerk. No alternative authentication methods are permitted.**

---

## Overview

- **Provider**: Clerk (https://clerk.com)
- **No Alternative Auth**: Do NOT implement custom auth, OAuth, sessions, or JWT handlers
- **Protected Routes**: /dashboard requires authentication
- **Redirect Behavior**: Logged-in users accessing / should redirect to /dashboard
- **Auth UI**: Sign in/sign up must launch as modals (not full-page forms)

---

## Environment Setup

Ensure these variables are defined in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

---

## Layout & Provider Setup

Wrap your entire app with `ClerkProvider` in `/app/layout.tsx`:

```typescript
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Link Shortener',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## Server-Side Authentication

### Protect Server Actions & Route Handlers

Always check for user authentication before performing protected operations:

```typescript
import { auth } from '@clerk/nextjs/server';

export async function createLink(originalUrl: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Proceed with authenticated action
}
```

---

## Front-End Authentication

### Access User Information

Use the `useUser()` hook in client components (`'use client'`):

```typescript
'use client';

import { useUser } from '@clerk/nextjs';

export function UserGreeting() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return <div>Welcome, {user.firstName}!</div>;
}
```

### Check Authentication Status

Use `useAuth()` hook to check if user is authenticated:

```typescript
'use client';

import { useAuth } from '@clerk/nextjs';

export function ProtectedComponent() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  return <div>Protected content</div>;
}
```

---

## Protected Routes

### Dashboard (/dashboard)

The `/dashboard` page must require authentication. Create `/app/dashboard/page.tsx`:

```typescript
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### Homepage Redirect

Redirect authenticated users from `/` to `/dashboard`. Create or update `/app/page.tsx`:

```typescript
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div>
      {/* Homepage content for unauthenticated users */}
    </div>
  );
}
```

---

## Authentication UI (Modals)

### Sign In Modal

Use Clerk's `SignInButton` component which launches as a modal:

```typescript
import { SignInButton } from '@clerk/nextjs';

export function AuthButton() {
  return (
    <SignInButton mode="modal">
      <button>Sign In</button>
    </SignInButton>
  );
}
```

### Sign Up Modal

Use `SignUpButton` for sign-up:

```typescript
import { SignUpButton } from '@clerk/nextjs';

export function SignUpPrompt() {
  return (
    <SignUpButton mode="modal">
      <button>Sign Up</button>
    </SignUpButton>
  );
}
```

### User Menu with Sign Out

```typescript
'use client';

import { UserButton } from '@clerk/nextjs';

export function UserMenu() {
  return (
    <UserButton afterSignOutUrl="/" />
  );
}
```

---

## API Routes with Authentication

Protect API routes by checking `auth()`:

```typescript
// /app/api/links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  // Process request with userId
  return NextResponse.json({ success: true });
}
```

---

## Role Checking (Optional)

If implementing role-based access, use `user.publicMetadata`:

```typescript
'use client';

import { useUser } from '@clerk/nextjs';

export function AdminPanel() {
  const { user } = useUser();
  const isAdmin = (user?.publicMetadata as { role?: string })?.role === 'admin';

  if (!isAdmin) {
    return <div>Not authorized</div>;
  }

  return <div>Admin content</div>;
}
```

---

## Middleware for Protected Routes (Optional)

For advanced route protection, use Clerk's `authMiddleware`:

```typescript
// /middleware.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { userId } = await auth();

  if (!userId && request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

---

## Key Rules

1. **Clerk Only**: Never implement custom authentication, sessions, or JWT handling.
2. **Check Auth**: Always verify `userId` before protected operations.
3. **Use Modals**: All sign-in/sign-up flows must use modal mode.
4. **Redirect Logged-In Users**: Redirect from `/` to `/dashboard` for authenticated users.
5. **Error Handling**: Throw or return 401 for unauthorized access.
6. **Type Safety**: Always type authentication results explicitly.

---

## Clerk Documentation Links

- [Clerk Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [useUser() Hook](https://clerk.com/docs/references/react/use-user)
- [useAuth() Hook](https://clerk.com/docs/references/react/use-auth)
- [auth() Server Helper](https://clerk.com/docs/references/backend/auth)
- [SignInButton & SignUpButton](https://clerk.com/docs/components/authentication/sign-in-button)
