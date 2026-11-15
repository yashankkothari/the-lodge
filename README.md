# yashank.site

My portfolio: data engineering work, side projects, and a case study per
project. Built with Next.js 16, Tailwind CSS v4, and Motion.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How it is put together

There is no database. Every piece of content lives in `config/` as typed
TypeScript, and the pages read it directly.

| Path | Holds |
| --- | --- |
| `config/site.ts` | Meta, personal info, section order, about, contact |
| `config/hero.ts` | Hero copy |
| `config/projects.ts` | Projects and their case studies |
| `config/experience.ts` | Roles |
| `config/skills.ts` | Stack groups |
| `config/socials.ts` | Contact links |
| `config/books.ts` | Bookshelf |
| `config/resume.ts` | Resume page content |

To change what the site says, change a config file. Components under
`components/landing/` are one section each; `app/page.tsx` maps over
`siteConfig.sectionOrder` and skips anything its `sectionFlags` entry turns
off.

## Routes

| Route | What it is |
| --- | --- |
| `/` | The one-page portfolio |
| `/portfolio` | Every project, grouped |
| `/resume` | Experience, education, skills, certifications |
| `/project/[id]` | One case study |

## Environment

Everything is optional. See `.env.example`.

- `GITHUB_TOKEN` turns on the contributions calendar. Without it the section is skipped.
- `DISCORD_USER_ID` feeds the presence widget in the footer.
- `TALVESS_STATS_KEY` adds live visitor growth to the footer counter.
- `NEXT_PUBLIC_POSTHOG_KEY` enables analytics.

## Credit

The layout, motion system, and component design come from
[Aditya Ojha's portfolio](https://github.com/AdityaKodez/adityaojha), used
under the MIT License. Content, artwork, and case studies are my own.

## License

MIT. See [LICENSE](./LICENSE).
