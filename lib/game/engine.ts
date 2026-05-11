import { CandidateScore, GameAnswer, Player, QuestionDefinition, QuestionRule, TeamId } from "@/types";

const ANSWER_WEIGHTS = {
  yes: 1,
  probably: 0.8,
  dont_know: 0.5,
  probably_not: 0.2,
  no: 0
} as const;

function normalizeText(value: unknown) {
  return String(value ?? "").toLowerCase();
}

export function evaluateRule(player: Player, rule: QuestionRule) {
  const source = player[rule.field];

  switch (rule.operator) {
    case "equals":
      return normalizeText(source) === normalizeText(rule.value) ? 1 : 0;
    case "contains":
      return normalizeText(source).includes(normalizeText(rule.value)) ? 1 : 0;
    case "includes":
      return Array.isArray(source) && source.map(normalizeText).includes(normalizeText(rule.value)) ? 1 : 0;
    case "gt":
      return Number(source) > Number(rule.value) ? 1 : 0;
    case "lt":
      return Number(source) < Number(rule.value) ? 1 : 0;
    default:
      return 0.5;
  }
}

export function rankCandidates(
  players: Player[],
  questions: QuestionDefinition[],
  answers: GameAnswer[],
  teamId?: TeamId
) {
  const filteredPlayers = teamId ? players.filter((player) => player.teamId === teamId) : players;
  const questionMap = new Map(questions.map((question) => [question.id, question]));

  const ranked = filteredPlayers
    .map((player) => {
      let score = 1;

      for (const answer of answers) {
        const question = questionMap.get(answer.questionId);

        if (!question) {
          continue;
        }

        const fit = evaluateRule(player, question.rule);
        const target = ANSWER_WEIGHTS[answer.answer];
        const closeness = answer.answer === "dont_know" ? 0.95 : Math.max(0.08, 1 - Math.abs(target - fit));
        score *= closeness * (1 + question.priority * 0.03);
      }

      return { player, score };
    })
    .sort((left, right) => right.score - left.score);

  const total = ranked.reduce((sum, candidate) => sum + candidate.score, 0) || 1;

  return ranked.map((candidate) => ({
    ...candidate,
    confidence: candidate.score / total
  })) satisfies CandidateScore[];
}

export function pickBestQuestion(
  players: Player[],
  questions: QuestionDefinition[],
  answers: GameAnswer[],
  teamId?: TeamId
) {
  const ranked = rankCandidates(players, questions, answers, teamId);
  const unanswered = questions.filter((question) => !answers.some((answer) => answer.questionId === question.id));

  const candidatePool = ranked.slice(0, Math.max(8, Math.ceil(ranked.length * 0.55)));

  const scoredQuestions = unanswered
    .filter((question) => !(teamId && question.rule.field === "teamId"))
    .map((question) => {
      const yesProbability = candidatePool.reduce(
        (sum, candidate) => sum + evaluateRule(candidate.player, question.rule) * candidate.confidence,
        0
      );
      const balance = 1 - Math.abs(0.5 - yesProbability) * 2;
      const weightedBalance = balance * (1 + question.priority * 0.12);

      return { question, score: weightedBalance };
    })
    .sort((left, right) => right.score - left.score);

  return scoredQuestions[0]?.question ?? null;
}

export function shouldMakeGuess(candidates: CandidateScore[], askedCount: number) {
  if (candidates.length === 0) {
    return false;
  }

  const [first, second] = candidates;
  const gap = first.confidence - (second?.confidence ?? 0);

  return first.confidence > 0.42 || gap > 0.18 || askedCount >= 8;
}

export function buildGuessStory(player: Player) {
  const flavour = [
    `${player.name} feels like the strongest fit.`,
    `${player.role} from ${player.country}.`,
    `${player.battingStyle} with ${player.bowlingStyle.toLowerCase()}.`
  ];

  if (player.traits.includes("captain")) {
    flavour.push("Leadership clues pushed the signal higher.");
  }

  if (player.traits.includes("aggressive")) {
    flavour.push("The aggressive batting profile was a major giveaway.");
  }

  if (player.traits.includes("death-bowler")) {
    flavour.push("Death-overs clues narrowed it down fast.");
  }

  return flavour.join(" ");
}

export function getDailyPlayer(players: Player[]) {
  const dayKey = new Date().toISOString().slice(0, 10);
  const hash = [...dayKey].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return players[hash % players.length];
}
