import { NextRequest, NextResponse } from "next/server";

import { getPlayers, savePlayers } from "@/lib/server/store";
import { Player } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Player;
  const players = await getPlayers();
  const updatedPlayers = [...players.filter((player) => player.id !== body.id), body];
  await savePlayers(updatedPlayers);
  return NextResponse.json(updatedPlayers);
}
