import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { links } from '../db/schema';

const db = drizzle(process.env.DATABASE_URL!);

const USER_ID = 'user_3CJ2wDEPaOBAoJjdjjtpgXqozZD';

const exampleLinks = [
  { shortCode: 'gh-repo',  url: 'https://github.com/explore' },
  { shortCode: 'yt-home',  url: 'https://www.youtube.com' },
  { shortCode: 'tw-feed',  url: 'https://twitter.com/home' },
  { shortCode: 'docs-next', url: 'https://nextjs.org/docs' },
  { shortCode: 'drizzle',  url: 'https://orm.drizzle.team/docs/overview' },
  { shortCode: 'clerk-qs', url: 'https://clerk.com/docs/quickstarts/nextjs' },
  { shortCode: 'tailwind', url: 'https://tailwindcss.com/docs' },
  { shortCode: 'shadcn',   url: 'https://ui.shadcn.com/docs' },
  { shortCode: 'neon-db',  url: 'https://neon.tech/docs/introduction' },
  { shortCode: 'ts-hb',    url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
];

async function main() {
  console.log(`Seeding 10 links for user: ${USER_ID}`);

  const rows = exampleLinks.map((link) => ({
    userId: USER_ID,
    shortCode: link.shortCode,
    url: link.url,
  }));

  const inserted = await db.insert(links).values(rows).returning();

  console.log(`Inserted ${inserted.length} links:`);
  for (const row of inserted) {
    console.log(`  [${row.id}] /${row.shortCode} -> ${row.url}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
