import Link from "next/link";
import { ArrowRight, Brain, Sparkles } from "lucide-react";

import { FeatureStrip } from "@/components/home/feature-strip";
import { TeamCard } from "@/components/home/team-card";
import { PageShell } from "@/components/layout/page-shell";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { TEAMS } from "@/lib/data/teams";
import { getPlayers } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const players = await getPlayers();

  return (
    <PageShell>
      <section className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
        <GlassPanel className="overflow-hidden p-8 sm:p-10">
          <div className="flex items-center gap-3 text-amber-100">
            <Sparkles className="h-5 w-5" />
            <p className="font-accent text-xs uppercase tracking-[0.32em]">Matchday Pavilion</p>
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-4xl uppercase leading-[1.05] tracking-[0.12em] sm:text-6xl xl:text-7xl">
            IPL Mind Reader AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/74">
            Think of any IPL player and let AI guess. The experience now feels like walking through a live cricket
            concourse with scoreboard panels, outfield textures, team dugouts, and smart questions that read the game.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/play">
              <NeonButton>
                Start Mind Reading
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </NeonButton>
            </Link>
            <Link href="/play?mode=daily">
              <NeonButton variant="ghost">Daily Quiz Mode</NeonButton>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "IPL Teams", value: "10" },
              { label: "Seed Player Profiles", value: String(players.length) },
              { label: "AI Question Cards", value: "30+" }
            ].map((item) => (
              <div key={item.label} className="rounded-[26px] border border-white/10 bg-black/15 p-5">
                <p className="font-accent text-xs uppercase tracking-[0.28em] text-white/60">{item.label}</p>
                <p className="mt-3 font-display text-4xl">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="flex items-center gap-3 text-amber-100">
            <Brain className="h-5 w-5" />
            <p className="font-accent text-xs uppercase tracking-[0.32em]">How The Innings Unfolds</p>
          </div>

          <div className="mt-6 space-y-4">
            {[
              "Think of any IPL player silently. No typing needed.",
              "The AI asks human-like cricket questions one at a time.",
              "Answers narrow the field through decision logic plus OpenAI question phrasing.",
              "A big-screen reveal card lands on the final guess with stats and achievements."
            ].map((step, index) => (
              <div key={step} className="rounded-[24px] border border-white/10 bg-black/15 p-5">
                <p className="font-accent text-xs uppercase tracking-[0.24em] text-amber-100/70">Over {index + 1}</p>
                <p className="mt-2 text-base leading-7 text-white/75">{step}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-accent text-xs uppercase tracking-[0.32em] text-amber-100/70">Franchise Dugouts</p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.14em] sm:text-5xl">
              Pick Your Franchise Hub
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/68">
            Every team hub now feels like a matchday dressing room with squad cards, voice intros, and grounded cricket styling.
          </p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {TEAMS.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              playersCount={players.filter((player) => player.teamId === team.id).length}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <FeatureStrip />
      </section>
    </PageShell>
  );
}
