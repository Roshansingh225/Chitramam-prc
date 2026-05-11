"use client";

import { useEffect, useState } from "react";

import { PlayerCard } from "@/components/player/player-card";
import { PlayerSpotlight } from "@/components/player/player-spotlight";
import { useSpeech } from "@/hooks/use-speech";
import { Player } from "@/types";

interface RosterGridProps {
  players: Player[];
}

export function RosterGrid({ players }: RosterGridProps) {
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const { speak, stop } = useSpeech();

  useEffect(() => {
    if (!activePlayer) {
      stop();
      return;
    }

    speak(activePlayer.voiceIntro);
  }, [activePlayer, speak, stop]);

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-2">
        {players.map((player, index) => (
          <PlayerCard key={player.id} player={player} index={index} onSelect={setActivePlayer} />
        ))}
      </div>
      <PlayerSpotlight player={activePlayer} onClose={() => setActivePlayer(null)} />
    </>
  );
}
