'use client';

import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-lg font-bold text-foreground">Link Shortener</div>
        <div className="flex gap-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button variant="outline" type="button">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button type="button">Sign Up</Button>
              </SignUpButton>
            </>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </div>
    </header>
  );
}
