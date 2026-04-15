import Link from "next/link";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Test Page",
  description:
    "A simple test page for verifying routing in the link shortener app.",
};

export default function TestPage() {
  return (
    <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Test Page</CardTitle>
          <CardDescription>
            This route is available at{" "}
            <span className="font-mono">/test-page</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use this page to confirm the app router is serving new pages
            correctly.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
