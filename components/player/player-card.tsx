"use client";

import { motion } from "framer-motion";
import { Mic2, Shirt, Target } from "lucide-react";

import { PlayerPortrait } from "@/components/player/player-portrait";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
  index: number;
  onSelect: (player: Player) => void;
}

export function PlayerCard({ player, index, onSelect }: PlayerCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      onClick={() => onSelect(player)}
      className="text-left"
    >
      <GlassPanel className="group h-full overflow-hidden p-3 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30">
        <div className="grid gap-4 md:grid-cols-[1fr,1.15fr]">
          <div className="min-h-[220px]">
            <PlayerPortrait player={player} className="h-full min-h-[220px]" />
          </div>

          <div className="flex flex-col justify-between gap-4 p-2">
            <div>
              <p className="font-accent text-xs uppercase tracking-[0.3em] text-cyan-100/70">{player.teamId.toUpperCase()}</p>
              <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.16em]">{player.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{player.bio}</p>
            </div>

            <div className="grid gap-3 text-sm text-white/78 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-cyan-100">
                  <Target className="h-4 w-4" />
                  <span className="font-accent uppercase tracking-[0.2em]">{player.role}</span>
                </div>
                <p className="mt-2">Bat: {player.battingStyle}</p>
                <p className="mt-1">Bowl: {player.bowlingStyle}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-amber-100">
                  <Shirt className="h-4 w-4" />
                  <span className="font-accent uppercase tracking-[0.2em]">Jersey {player.jerseyNumber}</span>
                </div>
                <p className="mt-2">Country: {player.country}</p>
                <p className="mt-1">Age: {player.age}</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
              <span className="font-accent uppercase tracking-[0.22em]">Open spotlight card</span>
              <Mic2 className="h-4 w-4" />
            </div>
          </div>
        </div>
      </GlassPanel>
    </motion.button>
  );
}
