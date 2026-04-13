import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link Shortener — Shorten, Share & Track URLs",
  description:
    "Create short, memorable links in seconds. Monitor click analytics and manage all your URLs from one simple dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider
          appearance={{
            baseTheme: undefined,
            elements: {
              modalBackdrop: "bg-black/50",
              modalContent: "bg-white dark:bg-zinc-900",
            },
          }}
        >
          <Header />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
