# Nova

A calm, customizable space to focus, relax, or just take a break. Leave it open on a second screen while you study or work: clock, pomodoro, ambient sounds, breathing exercises, reminders and quotes, each on its own space.

> v2 is a frontend-only rewrite. The original Next.js + Prisma version lives on the `v1-legacy` tag.

## Stack

Vite · React 19 (with React Compiler) · TypeScript · Tailwind CSS 4 · [Arc UI](https://uiarc.dev) · Motion · Zustand · Biome · Vitest. Deployed as static assets on Cloudflare Workers; backgrounds and sounds live on Cloudflare R2.

## Development

Requires Node 26+ and pnpm (the version is pinned in `package.json`).

```bash
pnpm install
pnpm dev
```

| Script                      | What it does                                              |
| --------------------------- | --------------------------------------------------------- |
| `pnpm dev`                  | Dev server. Serves the local `media/` folder at `/media`. |
| `pnpm build`                | Typecheck and production build into `dist/`.              |
| `pnpm lint` / `pnpm format` | Biome check / fix.                                        |
| `pnpm test`                 | Vitest in watch mode.                                     |
| `pnpm ci`                   | Everything CI runs.                                       |
| `pnpm deploy`               | Build and deploy with Wrangler.                           |

Media is not in git. Set `VITE_ASSETS_URL` (see `.env.example`) to the R2 bucket's public URL, or put files in `media/` for local work.

## License

MIT
