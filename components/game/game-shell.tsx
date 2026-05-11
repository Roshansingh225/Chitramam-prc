"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { BrainCircuit, Crown, LoaderCircle, Mic2, Radar, Sparkles, Trophy, Volume2, VolumeX } from "lucide-react";

import { PlayerPortrait } from "@/components/player/player-portrait";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { useCrowdAudio } from "@/hooks/use-crowd-audio";
import { useSpeech } from "@/hooks/use-speech";
import { TEAM_MAP, TEAMS } from "@/lib/data/teams";
import { formatNumber } from "@/lib/utils";
import { AnswerValue, GameAnswer, Player, QuestionDefinition, TeamId } from "@/types";

const answerButtons: Array<{ label: string; value: AnswerValue }> = [
  { label: "Yes", value: "yes" },
  { label: "Probably", value: "probably" },
  { label: "Don't Know", value: "dont_know" },
  { label: "Probably Not", value: "probably_not" },
  { label: "No", value: "no" }
];

interface GameResponseQuestion {
  mode: "question";
  question: QuestionDefinition;
  humanPrompt: string;
  candidates: Player[];
  remaining: number;
  confidence: number;
}

interface GameResponseGuess {
  mode: "guess";
  guess: Player;
  dramaticLine: string;
  candidates: Player[];
  confidence: number;
  story: string;
}

type GameResponse = GameResponseQuestion | GameResponseGuess;

interface GameShellProps {
  players: Player[];
  questions: QuestionDefinition[];
  initialTeamId?: TeamId;
  mode?: string;
}

export function GameShell({ players, questions, initialTeamId, mode }: GameShellProps) {
  const [teamId, setTeamId] = useState<TeamId | undefined>(initialTeamId);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [response, setResponse] = useState<GameResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enabled, setEnabled, speak, stop } = useSpeech();
  const { playReveal } = useCrowdAudio();

  const activePlayers = useMemo(
    () => (teamId ? players.filter((player) => player.teamId === teamId) : players),
    [players, teamId]
  );

  const fetchGameState = useCallback(async (nextAnswers: GameAnswer[], nextTeamId?: TeamId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetch("/api/game/next", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          answers: nextAnswers,
          teamId: nextTeamId,
          mode
        })
      });

      if (!result.ok) {
        throw new Error("Unable to continue the mind-reading session.");
      }

      const payload = (await result.json()) as GameResponse;
      setResponse(payload);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    void fetchGameState([], teamId);
  }, [fetchGameState, teamId]);

  useEffect(() => {
    if (!response || !enabled) {
      return;
    }

    if (response.mode === "question") {
      speak(response.humanPrompt);
      return;
    }

    speak(response.dramaticLine);
    playReveal();
    confetti({
      particleCount: 160,
      spread: 84,
      origin: { y: 0.62 }
    });
  }, [enabled, playReveal, response, speak]);

  function handleAnswer(answer: AnswerValue) {
    if (!response || response.mode !== "question") {
      return;
    }

    const nextAnswers = [...answers, { questionId: response.question.id, answer }];
    setAnswers(nextAnswers);
    void fetchGameState(nextAnswers, teamId);
  }

  function resetSession(nextTeamId = teamId) {
    stop();
    setAnswers([]);
    setResponse(null);
    void fetchGameState([], nextTeamId);
  }

  function changeTeam(nextTeamId?: TeamId) {
    stop();
    setAnswers([]);
    setResponse(null);
    setError(null);
    setTeamId(nextTeamId);
  }

  const confidenceLabel =
    response && `${Math.round(response.confidence * 100)}% match confidence`;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
      <GlassPanel className="overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-accent text-xs uppercase tracking-[0.32em] text-amber-100/70">Cricket Brain Box</p>
              <h1 className="mt-3 font-display text-3xl uppercase tracking-[0.14em] sm:text-5xl">
                IPL Mind Reader AI
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/74">
                Think of any IPL player. I’ll ask one smart cricket question at a time and narrow the field the way a
                sharp captain reads matchups before the next over.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEnabled((value) => !value)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-4 py-2 text-sm text-white/75 transition hover:text-white"
            >
              {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Voice {enabled ? "On" : "Off"}
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr,0.9fr]">
            <div className="rounded-[30px] border border-amber-200/15 bg-black/20 p-5">
              <div className="flex items-center gap-3 text-amber-50">
                <BrainCircuit className="h-5 w-5" />
                <p className="font-accent text-xs uppercase tracking-[0.28em]">Choose your franchise</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => changeTeam(undefined)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      !teamId
                      ? "border-amber-200/40 bg-amber-100/10 text-white shadow-glow"
                      : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                    }`}
                >
                  All Teams
                </button>
                {TEAMS.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => changeTeam(team.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      teamId === team.id
                        ? "border-amber-200/40 bg-amber-100/10 text-white shadow-glow"
                        : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    {team.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
              <p className="font-accent text-xs uppercase tracking-[0.28em] text-white/60">Scoreboard</p>
              <div className="mt-4 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-white/60">Candidate Pool</p>
                  <p className="mt-3 font-display text-3xl text-white">{activePlayers.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-white/60">Questions Asked</p>
                  <p className="mt-3 font-display text-3xl text-white">{answers.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                  <p className="text-white/60">Question Bank</p>
                  <p className="mt-3 font-display text-3xl text-white">{questions.length}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Mode: <span className="text-white">{mode === "daily" ? "Daily Quiz" : mode === "random" ? "Random Player" : "Classic"}</span>
              </p>
            </div>
          </div>

          {error ? <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="rounded-[32px] border border-amber-200/15 bg-amber-100/10 p-8"
              >
                <div className="flex items-center gap-3 text-amber-50">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  <span className="font-accent text-xs uppercase tracking-[0.28em]">
                    Reading form, role, and match clues...
                  </span>
                </div>
              </motion.div>
            ) : response?.mode === "question" ? (
              <motion.div
                key={response.question.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="rounded-[34px] border border-amber-200/20 bg-[linear-gradient(160deg,rgba(215,173,87,0.12),rgba(7,24,12,0.9))] p-8 shadow-stadium"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-amber-50">
                    <Radar className="h-5 w-5" />
                    <span className="font-accent text-xs uppercase tracking-[0.32em]">Question {answers.length + 1}</span>
                  </div>
                  <span className="rounded-full border border-amber-200/20 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/70">
                    {confidenceLabel}
                  </span>
                </div>

                <h2 className="mt-5 max-w-3xl font-display text-3xl uppercase leading-tight tracking-[0.14em] sm:text-4xl">
                  {response.humanPrompt}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/68">{response.question.description}</p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {answerButtons.map((answer) => (
                    <button
                      key={answer.value}
                      type="button"
                      onClick={() => handleAnswer(answer.value)}
                      className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-center font-accent text-xs uppercase tracking-[0.28em] text-white/78 transition hover:-translate-y-1 hover:border-amber-200/30 hover:bg-amber-100/10 hover:text-white"
                    >
                      {answer.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : response?.mode === "guess" ? (
              <motion.div
                key={response.guess.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[38px] border border-amber-300/25 bg-[linear-gradient(160deg,rgba(255,209,102,0.16),rgba(6,8,22,0.88))] p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3 text-amber-100">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-accent text-xs uppercase tracking-[0.32em]">Big Screen Reveal</span>
                </div>
                <h2 className="mt-4 max-w-3xl font-display text-3xl uppercase leading-tight tracking-[0.14em] sm:text-5xl">
                  {response.dramaticLine}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">{response.story}</p>

                <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
                  <div className="min-h-[380px]">
                    <PlayerPortrait player={response.guess} className="h-full min-h-[380px]" />
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="font-accent text-xs uppercase tracking-[0.28em] text-white/60">
                        {TEAM_MAP[response.guess.teamId].name}
                      </p>
                      <h3 className="mt-2 font-display text-4xl uppercase tracking-[0.14em]">{response.guess.name}</h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        `Role: ${response.guess.role}`,
                        `Country: ${response.guess.country}`,
                        `Batting: ${response.guess.battingStyle}`,
                        `Bowling: ${response.guess.bowlingStyle}`,
                        `Age: ${response.guess.age}`,
                        `Jersey: ${response.guess.jerseyNumber}`
                      ].map((detail) => (
                        <div key={detail} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/76">
                          {detail}
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="font-accent text-xs uppercase tracking-[0.24em] text-white/60">IPL Runs</p>
                        <p className="mt-3 font-display text-3xl">{formatNumber(response.guess.stats.runs)}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="font-accent text-xs uppercase tracking-[0.24em] text-white/60">IPL Wickets</p>
                        <p className="mt-3 font-display text-3xl">{formatNumber(response.guess.stats.wickets)}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="font-accent text-xs uppercase tracking-[0.24em] text-white/60">Strike Rate</p>
                        <p className="mt-3 font-display text-3xl">{response.guess.stats.strikeRate}</p>
                      </div>
                    </div>

                    <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-3 text-white">
                        <Trophy className="h-5 w-5 text-amber-200" />
                        <p className="font-accent text-xs uppercase tracking-[0.28em]">Achievements</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {response.guess.achievements.map((achievement) => (
                          <span
                            key={achievement}
                            className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/75"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <NeonButton onClick={() => resetSession(teamId)}>Play Again</NeonButton>
                      <Link href={`/team/${response.guess.teamId}`}>
                        <NeonButton variant="ghost">Open Team Hub</NeonButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[32px] border border-white/10 bg-white/5 p-8"
              >
                <div className="flex items-center gap-3 text-white">
                  <Mic2 className="h-5 w-5 text-amber-100" />
                  <p className="font-accent text-xs uppercase tracking-[0.28em]">Toss Briefing</p>
                </div>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
                  Lock a player into your mind, keep the answers honest, and let the AI narrow the field.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassPanel>

      <div className="space-y-6">
        <GlassPanel className="p-5">
          <div className="flex items-center gap-3 text-amber-50">
            <Radar className="h-5 w-5" />
            <p className="font-accent text-xs uppercase tracking-[0.3em]">Shortlist Board</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/70">
            The model blends decision-tree filtering with optional OpenAI rewriting to keep every question grounded in cricket logic.
          </p>
          <div className="mt-5 grid gap-3">
            {(response?.candidates ?? activePlayers.slice(0, 5)).slice(0, 5).map((player, index) => (
              <div key={player.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm text-white/85">{player.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/45">{player.role}</p>
                </div>
                <span className="font-accent text-xs uppercase tracking-[0.22em] text-amber-100">
                  {index === 0 ? "Hot Lead" : "Tracked"}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="flex items-center gap-3 text-amber-100">
            <Crown className="h-5 w-5" />
            <p className="font-accent text-xs uppercase tracking-[0.3em]">Clubhouse Notes</p>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/68">
            <li>Answer with instinct. &quot;Probably&quot; works beautifully when you are not fully certain.</li>
            <li>Filter by team if you want a tighter, faster mind-reading session.</li>
            <li>Voice mode uses browser speech synthesis for player intros and live questions.</li>
          </ul>
        </GlassPanel>
      </div>
    </div>
  );
}
