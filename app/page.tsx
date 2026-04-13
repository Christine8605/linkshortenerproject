import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Link2, BarChart2, Shield, Zap } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { LandingCTA } from '@/components/landing/LandingCTA';

const features = [
  {
    icon: Zap,
    title: 'Instant Shortening',
    description:
      'Turn any long URL into a clean, shareable short link in seconds. No sign-up required to try it out.',
  },
  {
    icon: BarChart2,
    title: 'Click Analytics',
    description:
      'Track how many times your links are clicked. Know exactly how your content performs.',
  },
  {
    icon: Link2,
    title: 'Manage Your Links',
    description:
      'View, copy, and delete all of your shortened links from a single organized dashboard.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your links are protected by Clerk authentication. Only you can manage the links you create.',
  },
];

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Shorten.{' '}
          <span className="text-muted-foreground">Share.</span>{' '}
          Track.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Create short, memorable links in seconds. Monitor click analytics and
          manage all your URLs from one simple dashboard.
        </p>
        <LandingCTA />
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-semibold text-foreground sm:text-3xl">
            Everything you need to manage your links
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="gap-4">
                <CardHeader className="pb-0">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          Ready to get started?
        </h2>
        <p className="mb-8 text-muted-foreground">
          Create a free account and start shortening links today.
        </p>
        <LandingCTA />
      </section>
    </div>
  );
}
