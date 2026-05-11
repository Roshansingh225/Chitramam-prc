import { NextRequest, NextResponse } from "next/server";

import { pickBestQuestion, rankCandidates, shouldMakeGuess, buildGuessStory } from "@/lib/game/engine";
import { humanizeQuestion, dramaticReveal } from "@/lib/server/openai";
import { getPlayers, getQuestions } from "@/lib/server/store";
import { GameAnswer, TeamId } from "@/types";

export const dynamic = "force-dynamic";

interface RequestPayload {
  answers?: GameAnswer[];
  teamId?: TeamId;
  mode?: string;
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as RequestPayload;
  const answers = payload.answers ?? [];
  const [players, questions] = await Promise.all([getPlayers(), getQuestions()]);

  const ranked = rankCandidates(players, questions, answers, payload.teamId);

  if (ranked.length === 0) {
    return NextResponse.json(
      {
        message: "No player profiles matched the current filter."
      },
      { status: 404 }
    );
  }

  if (shouldMakeGuess(ranked, answers.length)) {
    const guess = ranked[0].player;

    return NextResponse.json({
      mode: "guess" as const,
      guess,
      dramaticLine: await dramaticReveal(guess),
      story: buildGuessStory(guess),
      confidence: ranked[0].confidence,
      candidates: ranked.slice(0, 5).map((candidate) => candidate.player)
    });
  }

  const question = pickBestQuestion(players, questions, answers, payload.teamId) ?? questions[0];
  const humanPrompt = await humanizeQuestion(
    question,
    ranked.slice(0, 5).map((candidate) => candidate.player),
    answers
  );

  return NextResponse.json({
    mode: "question" as const,
    question,
    humanPrompt,
    candidates: ranked.slice(0, 5).map((candidate) => candidate.player),
    remaining: ranked.length,
    confidence: ranked[0].confidence
  });
}
