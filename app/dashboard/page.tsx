import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLinksByUserId } from "@/data/links";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateLinkDialog } from "./CreateLinkDialog";
import { EditLinkDialog } from "./EditLinkDialog";
import { DeleteLinkDialog } from "./DeleteLinkDialog";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const links = await getLinksByUserId(userId);

  return (
    <main className="container mx-auto max-w-3xl py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Links</h1>
        <CreateLinkDialog />
      </div>
      {links.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t created any links yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {links.map((link) => (
            <li key={link.id}>
              <Card>
                <CardHeader className="pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-medium truncate">
                      {link.url}
                    </CardTitle>
                    <div className="flex shrink-0 gap-2">
                      <EditLinkDialog
                        id={link.id}
                        url={link.url}
                        shortCode={link.shortCode}
                      />
                      <DeleteLinkDialog
                        id={link.id}
                        shortCode={link.shortCode}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <span>Short code: </span>
                  <span className="font-mono">{link.shortCode}</span>
                  <span className="ml-4 text-xs">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
