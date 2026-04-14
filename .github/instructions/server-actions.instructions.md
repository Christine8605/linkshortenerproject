---
description: Rules for implementing data mutations using server actions in this project. Apply when creating or modifying server actions, form submissions, or any data mutation logic.
applyTo: "**"
---

# Server Actions

## General Rules

- ALL data mutations must use server actions — no direct API route mutations
- Server actions must be called from **client components** only
- Server action files **must** be named `actions.ts` and colocated in the same directory as the component that calls them

## File Structure Example

```
app/dashboard/
  page.tsx
  SomeForm.tsx        ← client component that calls the action
  actions.ts          ← server action colocated here
```

## TypeScript

- All data passed to server actions must have explicit TypeScript types
- **Do NOT use `FormData`** as a parameter type — define typed interfaces or objects instead

```typescript
// ✅ Good
interface CreateLinkInput {
  originalUrl: string;
  customSlug?: string;
}

export async function createLink(input: CreateLinkInput) { ... }

// ❌ Avoid
export async function createLink(formData: FormData) { ... }
```

## Return Values

- Server actions must **never throw errors** — always return a typed result object with either a `success` or `error` property

```typescript
// ✅ Good
export async function createLink(input: CreateLinkInput) {
  // ...
  return { success: true, data: link };
  // or
  return { success: false, error: "Invalid input" };
}

// ❌ Avoid
export async function createLink(input: CreateLinkInput) {
  throw new Error("Invalid input");
}
```

## Validation

- All inputs must be validated using **Zod** before any logic executes

```typescript
import { z } from 'zod';

const createLinkSchema = z.object({
  originalUrl: z.string().url(),
  customSlug: z.string().min(3).optional(),
});

export async function createLink(input: CreateLinkInput) {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Invalid input' };
  ...
}
```

## Authentication

- Every server action must verify a logged-in user **before** any database operation

```typescript
import { auth } from '@clerk/nextjs/server';

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' };
  ...
}
```

## Database Access

- Server actions must **not** contain direct Drizzle queries
- All database operations must go through helper functions located in the `/data` directory

```typescript
// ✅ Good — use helper from /data
import { insertLink } from '@/data/links';

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' };
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Invalid input' };
  const link = await insertLink({ ...parsed.data, userId });
  return { success: true, data: link };
}

// ❌ Avoid — no direct Drizzle usage in actions
import { db } from '@/db';
import { links } from '@/db/schema';
await db.insert(links).values({ ... });
```

---

## applyTo: "\*\*"

# Server Actions

## Rules

- ALL data mutations must be done via server actions — no direct API routes for mutations
- Server actions must be called from **client components** only
- Server action files **must be named `actions.ts`** and colocated in the same directory as the component that calls them
- Every server action must begin by verifying a logged-in user via Clerk's `auth()` before any database operation
- All incoming data must use explicit TypeScript types — **never use `FormData` as a type**
- All input data must be validated with **zod** before use
- Database operations must go through helper functions in `/data` — server actions must **not** use Drizzle queries directly
- Server actions must **never throw errors** — always return a result object with a `success` boolean and either `data` on success or `error` (string message) on failure

## Example

```typescript
// app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createLink } from "@/data/links";

const createLinkSchema = z.object({
  originalUrl: z.string().url(),
});

interface CreateLinkInput {
  originalUrl: string;
}

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const link = await createLink({
    userId,
    originalUrl: parsed.data.originalUrl,
  });
  return { success: true, data: link };
}
```

## File Structure

```
app/dashboard/
  page.tsx          # Server component (renders client form)
  actions.ts        # Server actions for this route
  LinkForm.tsx      # Client component that calls the action
data/
  links.ts          # Drizzle query helpers (used by actions, not components)
```
