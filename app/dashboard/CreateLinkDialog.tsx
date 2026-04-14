'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createLinkAction } from './actions';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  shortCode: z
    .string()
    .max(50, { message: 'Short code must be at most 50 characters' })
    .regex(/^[a-zA-Z0-9_-]*$/, {
      message: 'Only letters, numbers, hyphens, and underscores',
    })
    .refine((v) => v === '' || v.length >= 3, {
      message: 'Short code must be at least 3 characters',
    })
    .optional()
    .or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '', shortCode: '' },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const result = await createLinkAction(values);
    if (result.success) {
      form.reset();
      setOpen(false);
    } else {
      setServerError(result.error);
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset();
      setServerError(null);
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Create Link</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new short link</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/long-url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short code <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="auto-generated if blank" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
            <Button type="submit" disabled={form.formState.isSubmitting} className="self-end">
              {form.formState.isSubmitting ? 'Creating…' : 'Create'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
