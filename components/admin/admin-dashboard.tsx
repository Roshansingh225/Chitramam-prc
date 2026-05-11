"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { DatabaseZap, Plus, Save, Trash2 } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { TEAMS } from "@/lib/data/teams";
import { slugify } from "@/lib/utils";
import { Player, QuestionDefinition } from "@/types";

interface AdminDashboardProps {
  initialPlayers: Player[];
  initialQuestions: QuestionDefinition[];
}

const emptyPlayer: Player = {
  id: "new-player",
  teamId: "csk",
  name: "",
  role: "Batsman",
  jerseyNumber: 0,
  country: "India",
  age: 24,
  battingStyle: "Right-hand bat",
  bowlingStyle: "Right-arm medium",
  traits: [],
  bio: "",
  achievements: [],
  voiceIntro: "",
  imageUrl: "",
  stats: {
    matches: 0,
    runs: 0,
    wickets: 0,
    strikeRate: 0,
    battingAverage: 0,
    bestPerformance: ""
  }
};

const emptyQuestion: QuestionDefinition = {
  id: "new-question",
  prompt: "",
  description: "",
  category: "identity",
  priority: 3,
  rule: {
    field: "traits",
    operator: "includes",
    value: "aggressive"
  }
};

export function AdminDashboard({ initialPlayers, initialQuestions }: AdminDashboardProps) {
  const [players, setPlayers] = useState(initialPlayers);
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedPlayerId, setSelectedPlayerId] = useState(initialPlayers[0]?.id ?? emptyPlayer.id);
  const [selectedQuestionId, setSelectedQuestionId] = useState(initialQuestions[0]?.id ?? emptyQuestion.id);
  const [status, setStatus] = useState<string>("");

  const selectedPlayer = useMemo(
    () => players.find((player) => player.id === selectedPlayerId) ?? emptyPlayer,
    [players, selectedPlayerId]
  );
  const selectedQuestion = useMemo(
    () => questions.find((question) => question.id === selectedQuestionId) ?? emptyQuestion,
    [questions, selectedQuestionId]
  );

  useEffect(() => {
    if (!status) {
      return;
    }

    const timer = window.setTimeout(() => setStatus(""), 2400);
    return () => window.clearTimeout(timer);
  }, [status]);

  function updatePlayer(partial: Partial<Player>) {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => (player.id === selectedPlayerId ? { ...player, ...partial } : player))
    );
  }

  function updateQuestion(partial: Partial<QuestionDefinition>) {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === selectedQuestionId ? { ...question, ...partial } : question
      )
    );
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updatePlayer({ imageUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  async function savePlayer() {
    const player = players.find((item) => item.id === selectedPlayerId);

    if (!player) {
      return;
    }

    const isNew = player.id === "new-player";
    const payload = {
      ...player,
      id: isNew ? slugify(`${player.teamId}-${player.name}`) : player.id,
      voiceIntro:
        player.voiceIntro ||
        `Hey, I'm ${player.name}, ready to light things up for ${player.teamId.toUpperCase()}.`
    };

    const result = await fetch(`/api/admin/players${isNew ? "" : `/${player.id}`}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const updatedPlayers = (await result.json()) as Player[];
    setPlayers(updatedPlayers);
    setSelectedPlayerId(payload.id);
    setStatus("Player saved.");
  }

  async function deletePlayer() {
    if (selectedPlayerId === "new-player") {
      setPlayers((current) => current.filter((player) => player.id !== "new-player"));
      setSelectedPlayerId(players[0]?.id ?? emptyPlayer.id);
      return;
    }

    const result = await fetch(`/api/admin/players/${selectedPlayerId}`, {
      method: "DELETE"
    });

    const updatedPlayers = (await result.json()) as Player[];
    setPlayers(updatedPlayers);
    setSelectedPlayerId(updatedPlayers[0]?.id ?? emptyPlayer.id);
    setStatus("Player removed.");
  }

  async function saveQuestion() {
    const question = questions.find((item) => item.id === selectedQuestionId);

    if (!question) {
      return;
    }

    const isNew = question.id === "new-question";
    const payload = {
      ...question,
      id: isNew ? slugify(question.prompt || "custom-question") : question.id
    };

    const result = await fetch(`/api/admin/questions${isNew ? "" : `/${question.id}`}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const updatedQuestions = (await result.json()) as QuestionDefinition[];
    setQuestions(updatedQuestions);
    setSelectedQuestionId(payload.id);
    setStatus("Question saved.");
  }

  async function deleteQuestion() {
    if (selectedQuestionId === "new-question") {
      setQuestions((current) => current.filter((question) => question.id !== "new-question"));
      setSelectedQuestionId(questions[0]?.id ?? emptyQuestion.id);
      return;
    }

    const result = await fetch(`/api/admin/questions/${selectedQuestionId}`, {
      method: "DELETE"
    });

    const updatedQuestions = (await result.json()) as QuestionDefinition[];
    setQuestions(updatedQuestions);
    setSelectedQuestionId(updatedQuestions[0]?.id ?? emptyQuestion.id);
    setStatus("Question removed.");
  }

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-accent text-xs uppercase tracking-[0.32em] text-amber-100/70">Scorers Desk</p>
            <h1 className="mt-3 font-display text-3xl uppercase tracking-[0.14em] sm:text-5xl">Admin Panel</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
              Add or edit player profiles, upload portraits, refresh stats, and create custom questions for the
              guessing engine.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200/20 bg-amber-100/10 px-4 py-3 text-sm text-amber-50">
            {status || "Changes persist in the local squad data store."}
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <GlassPanel className="p-5">
          <div className="flex items-center gap-3">
            <DatabaseZap className="h-5 w-5 text-amber-100" />
            <p className="font-accent text-xs uppercase tracking-[0.28em] text-white/70">Squad Database</p>
          </div>

          <div className="mt-5 flex gap-3">
            <NeonButton
              onClick={() => {
                setPlayers((current) => [...current, emptyPlayer]);
                setSelectedPlayerId("new-player");
              }}
            >
              <Plus className="mr-2 inline h-4 w-4" />
              Add Player
            </NeonButton>
          </div>

          <div className="mt-5 max-h-[620px] space-y-3 overflow-auto pr-1">
            {players.map((player) => (
              <button
                type="button"
                key={player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedPlayerId === player.id
                    ? "border-amber-200/35 bg-amber-100/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                <p className="font-medium">{player.name || "New Player"}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/45">
                  {player.teamId.toUpperCase()} • {player.role}
                </p>
              </button>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <p className="font-accent text-xs uppercase tracking-[0.28em] text-white/70">Edit Player</p>
          <div className="mt-5 grid gap-4">
            <input
              value={selectedPlayer.name}
              onChange={(event) => updatePlayer({ name: event.target.value })}
              placeholder="Player name"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/35"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={selectedPlayer.teamId}
                onChange={(event) => updatePlayer({ teamId: event.target.value as Player["teamId"] })}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              >
                {TEAMS.map((team) => (
                  <option key={team.id} value={team.id} className="bg-slate-950">
                    {team.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedPlayer.role}
                onChange={(event) => updatePlayer({ role: event.target.value as Player["role"] })}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              >
                {["Batsman", "Bowler", "All-Rounder", "Wicketkeeper-Batsman"].map((role) => (
                  <option key={role} value={role} className="bg-slate-950">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={selectedPlayer.country}
                onChange={(event) => updatePlayer({ country: event.target.value })}
                placeholder="Country"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />
              <input
                type="number"
                value={selectedPlayer.age}
                onChange={(event) => updatePlayer({ age: Number(event.target.value) })}
                placeholder="Age"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={selectedPlayer.battingStyle}
                onChange={(event) => updatePlayer({ battingStyle: event.target.value })}
                placeholder="Batting style"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />
              <input
                value={selectedPlayer.bowlingStyle}
                onChange={(event) => updatePlayer({ bowlingStyle: event.target.value })}
                placeholder="Bowling style"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />
            </div>

            <textarea
              value={selectedPlayer.bio}
              onChange={(event) => updatePlayer({ bio: event.target.value })}
              placeholder="Bio"
              rows={4}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
            />
            <textarea
              value={selectedPlayer.voiceIntro}
              onChange={(event) => updatePlayer({ voiceIntro: event.target.value })}
              placeholder="Voice intro line"
              rows={3}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-white/70" />
            <input
              value={selectedPlayer.traits.join(", ")}
              onChange={(event) =>
                updatePlayer({
                  traits: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean) as Player["traits"]
                })
              }
              placeholder="Traits comma separated"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
            />
            <input
              value={selectedPlayer.achievements.join(", ")}
              onChange={(event) =>
                updatePlayer({
                  achievements: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                })
              }
              placeholder="Achievements comma separated"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
            />

            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="number"
                value={selectedPlayer.stats.runs}
                onChange={(event) =>
                  updatePlayer({ stats: { ...selectedPlayer.stats, runs: Number(event.target.value) } })
                }
                placeholder="Runs"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />
              <input
                type="number"
                value={selectedPlayer.stats.wickets}
                onChange={(event) =>
                  updatePlayer({ stats: { ...selectedPlayer.stats, wickets: Number(event.target.value) } })
                }
                placeholder="Wickets"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />
              <input
                type="number"
                value={selectedPlayer.stats.strikeRate}
                onChange={(event) =>
                  updatePlayer({ stats: { ...selectedPlayer.stats, strikeRate: Number(event.target.value) } })
                }
                placeholder="Strike rate"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <NeonButton onClick={savePlayer}>
                <Save className="mr-2 inline h-4 w-4" />
                Save Player
              </NeonButton>
              <NeonButton variant="ghost" onClick={deletePlayer}>
                <Trash2 className="mr-2 inline h-4 w-4" />
                Delete
              </NeonButton>
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-accent text-xs uppercase tracking-[0.28em] text-white/70">Question Library</p>
            <NeonButton
              variant="ghost"
              onClick={() => {
                setQuestions((current) => [...current, emptyQuestion]);
                setSelectedQuestionId("new-question");
              }}
            >
              <Plus className="mr-2 inline h-4 w-4" />
              Add Question
            </NeonButton>
          </div>

          <div className="mt-5 max-h-[460px] space-y-3 overflow-auto pr-1">
            {questions.map((question) => (
              <button
                type="button"
                key={question.id}
                onClick={() => setSelectedQuestionId(question.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedQuestionId === question.id
                    ? "border-amber-200/35 bg-amber-100/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                <p className="line-clamp-2">{question.prompt || "New question"}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/45">{question.category}</p>
              </button>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <p className="font-accent text-xs uppercase tracking-[0.28em] text-white/70">Edit Question</p>
          <div className="mt-5 grid gap-4">
            <input
              value={selectedQuestion.prompt}
              onChange={(event) => updateQuestion({ prompt: event.target.value })}
              placeholder="Prompt"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
            />
            <textarea
              value={selectedQuestion.description}
              onChange={(event) => updateQuestion({ description: event.target.value })}
              placeholder="Description"
              rows={4}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={selectedQuestion.category}
                onChange={(event) =>
                  updateQuestion({ category: event.target.value as QuestionDefinition["category"] })
                }
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              >
                {["team", "role", "style", "career", "identity"].map((category) => (
                  <option key={category} value={category} className="bg-slate-950">
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={selectedQuestion.priority}
                onChange={(event) => updateQuestion({ priority: Number(event.target.value) })}
                placeholder="Priority"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <select
                value={selectedQuestion.rule.field}
                onChange={(event) =>
                  updateQuestion({ rule: { ...selectedQuestion.rule, field: event.target.value as QuestionDefinition["rule"]["field"] } })
                }
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              >
                {["teamId", "role", "country", "battingStyle", "bowlingStyle", "traits", "age", "jerseyNumber", "name"].map((field) => (
                  <option key={field} value={field} className="bg-slate-950">
                    {field}
                  </option>
                ))}
              </select>
              <select
                value={selectedQuestion.rule.operator}
                onChange={(event) =>
                  updateQuestion({
                    rule: {
                      ...selectedQuestion.rule,
                      operator: event.target.value as QuestionDefinition["rule"]["operator"]
                    }
                  })
                }
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              >
                {["equals", "includes", "contains", "gt", "lt"].map((operator) => (
                  <option key={operator} value={operator} className="bg-slate-950">
                    {operator}
                  </option>
                ))}
              </select>
              <input
                value={String(selectedQuestion.rule.value)}
                onChange={(event) =>
                  updateQuestion({
                    rule: {
                      ...selectedQuestion.rule,
                      value:
                        selectedQuestion.rule.field === "age" || selectedQuestion.rule.field === "jerseyNumber"
                          ? Number(event.target.value)
                          : event.target.value
                    }
                  })
                }
                placeholder="Rule value"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <NeonButton onClick={saveQuestion}>
                <Save className="mr-2 inline h-4 w-4" />
                Save Question
              </NeonButton>
              <NeonButton variant="ghost" onClick={deleteQuestion}>
                <Trash2 className="mr-2 inline h-4 w-4" />
                Delete
              </NeonButton>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
