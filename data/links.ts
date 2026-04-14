import { db } from '@/db';
import { links } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export async function getLinksByUserId(userId: string) {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));
}

interface InsertLinkInput {
  userId: string;
  url: string;
  shortCode: string;
}

export async function insertLink(input: InsertLinkInput) {
  const result = await db
    .insert(links)
    .values(input)
    .returning();
  return result[0];
}

interface UpdateLinkInput {
  url: string;
  shortCode: string;
}

export async function updateLink(id: number, userId: string, input: UpdateLinkInput) {
  const result = await db
    .update(links)
    .set({ url: input.url, shortCode: input.shortCode, updatedAt: new Date() })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return result[0] ?? null;
}

export async function deleteLink(id: number, userId: string) {
  const result = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return result[0] ?? null;
}

export async function getLinkByShortCode(shortCode: string) {
  const result = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);
  return result[0] ?? null;
}
