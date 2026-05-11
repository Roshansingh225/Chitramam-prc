import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";
import { Team } from "@/types";

interface TeamCardProps {
  team: Team;
  playersCount: number;
}

export function TeamCard({ team, playersCount }: TeamCardProps) {
  return (
    <Link href={`/team/${team.id}`} className="group block">
      <GlassPanel className="relative h-full overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-200/25">
        <div className={`absolute inset-0 bg-gradient-to-br ${team.glow} opacity-70`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_35%)]" />

        <div className="relative flex h-full flex-col justify-between gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-2xl uppercase tracking-[0.25em]">{team.shortName}</p>
              <p className="mt-2 text-sm text-white/70">{team.name}</p>
            </div>
            <div className="rounded-full border border-white/15 bg-black/20 p-3 text-white/75 transition group-hover:text-white">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>

          <div>
            <p className="font-accent text-xs uppercase tracking-[0.26em] text-amber-100/70">{team.strapline}</p>
            <div className="mt-4 flex items-center gap-3 text-sm text-white/75">
              <MapPin className="h-4 w-4 text-amber-100" />
              {team.city}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-white/75">
                {playersCount} player profiles
              </span>
              <span className="font-accent uppercase tracking-[0.2em] text-amber-100">Open dugout</span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </Link>
  );
}
