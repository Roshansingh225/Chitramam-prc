import { promises as fs } from "fs";
import path from "path";

import { SEED_PLAYERS, SEED_QUESTIONS } from "@/lib/data/seed";
import { Player, QuestionDefinition } from "@/types";

const runtimeDir = path.join(process.cwd(), "data", "runtime");
const playersFile = path.join(runtimeDir, "players.json");
const questionsFile = path.join(runtimeDir, "questions.json");

async function ensureFile<T>(filePath: string, seedData: T) {
  await fs.mkdir(runtimeDir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(seedData, null, 2), "utf8");
  }
}

async function readJson<T>(filePath: string, seedData: T) {
  await ensureFile(filePath, seedData);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJson<T>(filePath: string, value: T) {
  await ensureFile(filePath, value);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

export async function getPlayers() {
  return readJson<Player[]>(playersFile, SEED_PLAYERS);
}

export async function savePlayers(players: Player[]) {
  await writeJson(playersFile, players);
  return players;
}

export async function getQuestions() {
  return readJson<QuestionDefinition[]>(questionsFile, SEED_QUESTIONS);
}

export async function saveQuestions(questions: QuestionDefinition[]) {
  await writeJson(questionsFile, questions);
  return questions;
}
