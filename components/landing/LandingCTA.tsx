'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function LandingCTA() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <SignUpButton mode="modal">
        <Button size="lg" className="px-8 py-6 text-base">
          Get Started Free
        </Button>
      </SignUpButton>
      <SignInButton mode="modal">
        <Button variant="outline" size="lg" className="px-8 py-6 text-base">
          Sign In
        </Button>
      </SignInButton>
    </div>
  );
}
