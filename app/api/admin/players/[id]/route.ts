import { NextRequest, NextResponse } from "next/server";

import { getPlayers, savePlayers } from "@/lib/server/store";
import { Player } from "@/types";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as Player;
  const players = await getPlayers();
  const updatedPlayers = players.map((player) => (player.id === id ? { ...player, ...body } : player));
  await savePlayers(updatedPlayers);
  return NextResponse.json(updatedPlayers);
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const players = await getPlayers();
  const updatedPlayers = players.filter((player) => player.id !== id);
  await savePlayers(updatedPlayers);
  return NextResponse.json(updatedPlayers);
}
