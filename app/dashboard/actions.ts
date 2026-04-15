"use server";

import { z } from "zod";
import { randomBytes } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { insertLink, updateLink, deleteLink } from "@/data/links";

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateShortCode(): string {
  const bytes = randomBytes(10);
  return Array.from(bytes)
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join("");
}

const createLinkSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  shortCode: z
    .string()
    .min(3, { message: "Short code must be at least 3 characters" })
    .max(50, { message: "Short code must be at most 50 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Short code may only contain letters, numbers, hyphens, and underscores",
    })
    .optional()
    .or(z.literal("")),
});

interface CreateLinkInput {
  url: string;
  shortCode?: string;
}

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { success: false as const, error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    const shortCode =
      parsed.data.shortCode && parsed.data.shortCode.length > 0
        ? parsed.data.shortCode
        : generateShortCode();
    const link = await insertLink({ userId, url: parsed.data.url, shortCode });
    revalidatePath("/dashboard");
    return { success: true as const, data: link };
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Failed to create link";
    if (message.includes("unique")) {
      return {
        success: false as const,
        error: "That short code is already taken",
      };
    }
    return { success: false as const, error: "Failed to create link" };
  }
}

const editLinkSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  shortCode: z
    .string()
    .min(3, { message: "Short code must be at least 3 characters" })
    .max(50, { message: "Short code must be at most 50 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Short code may only contain letters, numbers, hyphens, and underscores",
    }),
});

interface EditLinkInput {
  id: number;
  url: string;
  shortCode: string;
}

export async function editLinkAction(input: EditLinkInput) {
  const { userId } = await auth();
  if (!userId) return { success: false as const, error: "Unauthorized" };

  const parsed = editLinkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    const link = await updateLink(input.id, userId, {
      url: parsed.data.url,
      shortCode: parsed.data.shortCode,
    });
    if (!link) return { success: false as const, error: "Link not found" };
    revalidatePath("/dashboard");
    return { success: true as const, data: link };
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Failed to update link";
    if (message.includes("unique")) {
      return {
        success: false as const,
        error: "That short code is already taken",
      };
    }
    return { success: false as const, error: "Failed to update link" };
  }
}

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

interface DeleteLinkInput {
  id: number;
}

export async function deleteLinkAction(input: DeleteLinkInput) {
  const { userId } = await auth();
  if (!userId) return { success: false as const, error: "Unauthorized" };

  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: "Invalid input" };

  try {
    const link = await deleteLink(input.id, userId);
    if (!link) return { success: false as const, error: "Link not found" };
    revalidatePath("/dashboard");
    return { success: true as const };
  } catch (err) {
    console.error(err);
    return { success: false as const, error: "Failed to delete link" };
  }
}
