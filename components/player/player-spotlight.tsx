"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Trophy, X } from "lucide-react";

import { PlayerPortrait } from "@/components/player/player-portrait";
import { NeonButton } from "@/components/ui/neon-button";
import { formatNumber } from "@/lib/utils";
import { Player } from "@/types";

interface PlayerSpotlightProps {
  player: Player | null;
  onClose: () => void;
}

export function PlayerSpotlight({ player, onClose }: PlayerSpotlightProps) {
  return (
    <AnimatePresence>
      {player ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="glass-panel neon-border relative max-h-[90vh] w-full max-w-5xl overflow-auto p-4 sm:p-6"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-3 text-white/75 transition hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
              <div className="min-h-[420px]">
                <PlayerPortrait player={player} className="h-full min-h-[420px]" />
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <p className="font-accent text-xs uppercase tracking-[0.32em] text-amber-100/70">{player.teamId.toUpperCase()} Player Card</p>
                  <h2 className="mt-2 font-display text-4xl uppercase tracking-[0.16em]">{player.name}</h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-white/76">{player.bio}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    `Role: ${player.role}`,
                    `Country: ${player.country}`,
                    `Jersey: ${player.jerseyNumber}`,
                    `Batting: ${player.battingStyle}`,
                    `Bowling: ${player.bowlingStyle}`,
                    `Age: ${player.age}`
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-white/80">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="rounded-[26px] border border-amber-200/20 bg-amber-100/10 p-5">
                  <div className="flex items-center gap-3 text-amber-50">
                    <Trophy className="h-5 w-5" />
                    <p className="font-accent text-xs uppercase tracking-[0.28em]">Achievements</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {player.achievements.map((achievement) => (
                      <span
                        key={achievement}
                        className="rounded-full border border-amber-100/15 bg-black/20 px-4 py-2 text-sm text-white/80"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] border border-white/10 bg-black/15 p-4">
                    <p className="font-accent text-xs uppercase tracking-[0.28em] text-white/60">IPL Runs</p>
                    <p className="mt-3 font-display text-3xl">{formatNumber(player.stats.runs)}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-black/15 p-4">
                    <p className="font-accent text-xs uppercase tracking-[0.28em] text-white/60">IPL Wickets</p>
                    <p className="mt-3 font-display text-3xl">{formatNumber(player.stats.wickets)}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-black/15 p-4">
                    <p className="font-accent text-xs uppercase tracking-[0.28em] text-white/60">Strike Rate</p>
                    <p className="mt-3 font-display text-3xl">{player.stats.strikeRate}</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <NeonButton onClick={onClose}>Back to squad</NeonButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
