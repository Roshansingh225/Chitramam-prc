# IPL Mind Reader AI

A futuristic IPL player guessing web app inspired by Akinator, built with Next.js, React, Tailwind CSS, Framer Motion, and Three.js.

## Highlights

- Full-screen neon stadium atmosphere with a live 3D scene
- Team hubs for CSK, RCB, MI, GT, KKR, SRH, RR, PBKS, LSG, and DC
- Akinator-style questioning flow powered by a decision-tree engine
- Optional OpenAI question rewriting and reveal lines with `OPENAI_API_KEY`
- Browser speech synthesis for player intros and spoken questions
- Dramatic reveal card with stats, achievements, and crowd-style audio
- File-backed admin panel for editing players and custom questions

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file if you want OpenAI-powered question phrasing:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

If no key is provided, the app uses the built-in deterministic question engine only.

## Project Structure

```text
app/                  Next.js app router pages and API routes
components/           Reusable UI, game, player, and layout components
hooks/                Browser speech and reveal audio helpers
lib/data/             Teams and seeded IPL player/question data
lib/game/             Guessing engine and ranking logic
lib/server/           File-backed runtime store and OpenAI helpers
data/runtime/         Mutable JSON store used by the admin panel
types/                Shared TypeScript models
```

## Notes

- The seed roster is meant to power the experience out of the box and can be edited from `/admin`.
- Player portraits fall back to hologram cards until you upload real images from the admin panel.
- The runtime data store writes to local JSON files, which is great for local prototyping and demo deployments.
