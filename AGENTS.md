<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Link Shortener Project — Agent Coding Instructions

This document defines the coding standards and best practices for LLM agents working on this Next.js 16.2.3 project. Additional guidance is available in the `/docs` directory with specific instructions for each domain.

## Project Overview

**Stack**: Next.js 16.2.3 | React 19.2.4 | TypeScript 5 | Drizzle ORM | Neon Serverless | Tailwind CSS | shadcn/ui | Clerk Auth

**Purpose**: Link shortener application with user authentication, database persistence, and modern component-based UI.

---

## ⚠️ CRITICAL: Read Domain-Specific Instructions First

**BEFORE generating any code**, you MUST read the relevant instruction files in the `/docs` directory:

- **[authentication.md](../docs/authentication.md)** — Clerk authentication, protected routes, sign-in/sign-up flows
- **[shadcn-ui.md](../docs/shadcn-ui.md)** — UI component standards and usage patterns

These files contain essential, non-negotiable requirements that override general guidance. Failing to read them will result in code that violates project standards.

---

## Core Principles

1. **Type Safety First**: Always use strict TypeScript. No `any` types without explicit justification.
2. **Server Components by Default**: Prefer Next.js Server Components unless client interactivity is required.
3. **DRY & Composability**: Extract reusable logic into separate functions/components.
4. **Accessibility**: Use semantic HTML and ARIA attributes appropriately.
5. **Performance**: Optimize bundle size, use lazy loading, minimize client-side JavaScript.
6. **Error Handling**: Graceful error handling with user-friendly feedback.

---

## File Organization & Structure

```
/app              - Next.js App Router pages, layouts, route handlers
/components       - Reusable React components (organized by domain)
  /ui             - UI primitives and building blocks (buttons, inputs, etc.)
  /[domain]       - Domain-specific components (only if additional folders needed)
/db               - Database schema, migrations, and initialization
/lib              - Shared utilities, helpers, types, and constants
/public           - Static assets
/docs             - Agent instructions for specific domains (see below)
```

### Documentation Structure

Comprehensive domain-specific instructions are located in `/docs`. Each file contains implementation requirements and best practices:

- **[authentication.md](../docs/authentication.md)** — READ THIS before implementing any authentication, protected routes, sign-in/sign-up flows, or user context features.
- **[shadcn-ui.md](../docs/shadcn-ui.md)** — READ THIS before creating any UI component. All UI elements must use shadcn/ui; custom components are not permitted.

**Non-Negotiable**: Always read the relevant `/docs` file(s) FIRST. Code that violates these instructions will be rejected.

---

## TypeScript Standards

### General Rules

- **Strict Mode**: Always enabled (`"strict": true` in `tsconfig.json`)
- **Path Aliases**: Use `@/` prefix for all absolute imports (configured in `tsconfig.json`)
- **No `any`**: Explicitly type all variables, parameters, and return values
- **Prefer Interfaces for Objects**: Use `interface` for object shapes; `type` for unions and complex types

### Example Patterns

```typescript
// ✅ Good: Explicit types
interface LinkData {
  id: string;
  shortCode: string;
  originalUrl: string;
  createdAt: Date;
}

function getLinkById(id: string): Promise<LinkData | null> {
  // ...
}

// ❌ Avoid: Implicit any
function processLink(link: any) {
  // ...
}
```

---

## React Component Standards

### Component Structure

- **Server Components by Default**: Components are server components unless marked `'use client'`
- **Props Typing**: Always define explicit prop types using `interface`
- **Naming**: PascalCase for components, kebab-case for file names

```typescript
// ✅ Components live in /components/[domain]/ComponentName.tsx
interface LinkCardProps {
  linkId: string;
  shortCode: string;
  onClick?: () => void;
}

export function LinkCard({ linkId, shortCode, onClick }: LinkCardProps) {
  return (
    <div className="p-4 border rounded" onClick={onClick}>
      {shortCode}
    </div>
  );
}
```

### Client Components

Mark with `'use client'` at the top of the file. Minimize the scope of client components:

```typescript
'use client';

import { useState } from 'react';

export function LinkForm() {
  const [url, setUrl] = useState('');
  // ...
}
```

---

## Database (Drizzle ORM)

### Schema Definition

All database tables are defined in `/db/schema.ts`:

```typescript
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  clickCount: integer('click_count').default(0),
});
```

### Querying

- Use `/db/index.ts` for database client initialization
- Create domain-specific query functions in `/lib` or `/app/actions`
- Always handle database errors gracefully

```typescript
// ✅ Good: Isolated query function
export async function getLinkByShortCode(shortCode: string) {
  try {
    const result = await db.select().from(links).where(
      eq(links.shortCode, shortCode)
    );
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed:', error);
    return null;
  }
}
```

---

## Authentication (Clerk)

### Integration Points

- **Layout**: `ClerkProvider` wraps the entire app in `/app/layout.tsx`
- **Protected Routes**: Use Clerk's `auth()` middleware or components
- **User Context**: Access user info via `useUser()` hook in client components

### Protected Server Actions

```typescript
import { auth } from '@clerk/nextjs/server';

export async function createLink(originalUrl: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Create link for authenticated user
}
```

---

## Styling with Tailwind CSS & shadcn/ui

### Conventions

- **Utility-First**: Use Tailwind classes for all styling
- **shadcn/ui Components**: Use for complex UI elements (buttons, modals, forms)
- **Custom CSS**: Minimal; prefer Tailwind or component library
- **Responsive**: Mobile-first approach with `sm:`, `md:`, `lg:` breakpoints
- **Dark Mode**: Support dark mode with `dark:` prefixes

### Example

```typescript
// ✅ Good: Tailwind + shadcn/ui
export function LinkButton() {
  return (
    <Button 
      className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-900"
    >
      Create Link
    </Button>
  );
}
```

---

## API Routes & Server Actions

### Route Handlers

Create API routes in the app directory under `/app/api/[route]/route.ts`:

```typescript
// /app/api/links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { originalUrl } = await req.json();
  // Process request
}
```

### Server Actions

For mutations within components/pages, use Next.js Server Actions (no file needed):

```typescript
'use server';

import { auth } from '@clerk/nextjs/server';

export async function createLink(originalUrl: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  
  // Create and return link
}
```

---

## Error Handling

### Catch-All Error Boundary

- Use `/app/error.tsx` for global error handling
- Provide user-friendly error messages
- Log errors for debugging (avoid exposing internal details)

### Specific Error Patterns

```typescript
// ✅ Good: Structured error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  if (error instanceof DatabaseError) {
    // Handle DB-specific error
  } else if (error instanceof ValidationError) {
    // Handle validation error
  } else {
    // Log unexpected error
    console.error('Unexpected error:', error);
  }
  throw new Error('Operation failed. Please try again.');
}
```

---

## ESLint & Code Quality

### Configuration

ESLint is configured with Next.js core web vitals and TypeScript strict rules. Run before committing:

```bash
npm run lint
```

### Common Issues to Avoid

- Unused variables
- Missing `alt` text on images
- Breaking accessibility rules
- Unoptimized images (`next/image` required)
- Synchronous operations that block rendering

---

## Performance Guidelines

1. **Image Optimization**: Always use `next/image` with explicit width/height
2. **Lazy Loading**: Use dynamic imports for heavy components
3. **Bundle Size**: Minimize external dependencies; prefer Tailwind utilities
4. **Database Queries**: Optimize queries; use indexes and pagination
5. **Caching**: Leverage Next.js caching strategies (revalidateTag, revalidatePath)

---

## Development Workflow

### Running the Project

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Database Migrations

```bash
npx drizzle-kit push  # Apply schema changes
npx drizzle-kit drop  # Reset schema (dev only)
```

### Environment Variables

Must be defined in `.env.local`:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

---

## Code Review Checklist for LLMs

Before committing code:

- [ ] TypeScript strict mode passes without errors
- [ ] ESLint passes (`npm run lint`)
- [ ] All functions/components have explicit type annotations
- [ ] Server components are used by default; `'use client'` only when necessary
- [ ] Error handling is comprehensive and user-friendly
- [ ] Accessibility is considered (semantic HTML, ARIA where needed)
- [ ] Images use `next/image` with width/height
- [ ] Database queries are optimized and error-handled
- [ ] Clerk authentication is enforced in protected routes
- [ ] Tailwind classes are used for styling; custom CSS is minimal

---

## References & Additional Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [Clerk Authentication](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Component Library](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: April 2026 | Project Version: 0.1.0
