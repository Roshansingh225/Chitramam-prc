/* eslint-disable @next/next/no-img-element */

import { UserCircle2 } from "lucide-react";

import { TEAM_MAP } from "@/lib/data/teams";
import { getInitials } from "@/lib/utils";
import { Player } from "@/types";

interface PlayerPortraitProps {
  player: Player;
  className?: string;
}

export function PlayerPortrait({ player, className = "" }: PlayerPortraitProps) {
  const team = TEAM_MAP[player.teamId];

  if (player.imageUrl) {
    return (
      <img
        src={player.imageUrl}
        alt={player.name}
        className={`h-full w-full rounded-[28px] object-cover object-top ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative flex h-full w-full items-end overflow-hidden rounded-[28px] border border-white/10 bg-black/20 ${className}`}
      style={{
        background: `radial-gradient(circle at top, ${team.accent}35 0%, transparent 38%), linear-gradient(160deg, ${team.primary}40 0%, rgba(6, 8, 22, 0.85) 72%)`
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_24%)]" />
      <div className="absolute left-1/2 top-6 flex h-36 w-36 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/20">
        <UserCircle2 className="h-24 w-24" />
      </div>
      <div className="absolute inset-x-6 bottom-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-4xl uppercase tracking-[0.18em] text-white/90">{getInitials(player.name)}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">{team.shortName} Hologram Portrait</p>
          </div>
          <div
            className="h-10 w-10 rounded-full border border-white/10"
            style={{ backgroundColor: `${team.accent}30` }}
          />
        </div>
      </div>
    </div>
  );
}
