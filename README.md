# manasgoyal95.github.io

Personal portfolio — [manasgoyal95.github.io](https://manasgoyal95.github.io).

Built with [Astro](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com). Static output, no client-side framework; the only JS is the theme toggle and mobile nav.

## Editing content

All copy lives in `src/data/`:

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, tagline, links, headline stats |
| `experience.ts` | Work history and education |
| `projects.ts` | Case studies (each becomes `/work/<slug>`) |
| `skills.ts` | Skill groups |

The résumé PDF is `public/Manas_Goyal_Resume.pdf`; replace the file to update the download.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Deploy

Pushes to `main` build and publish to GitHub Pages via `.github/workflows/deploy.yml`.
