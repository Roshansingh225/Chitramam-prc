import { GameAnswer, Player, QuestionDefinition } from "@/types";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

export async function humanizeQuestion(
  baseQuestion: QuestionDefinition,
  candidates: Player[],
  answers: GameAnswer[]
) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return baseQuestion.prompt;
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You rewrite cricket player guessing questions. Keep each question natural, energetic, and under 18 words. Return only the rewritten question."
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  baseQuestion: baseQuestion.prompt,
                  shortlistedPlayers: candidates.slice(0, 5).map((player) => player.name),
                  answerHistory: answers
                })
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      return baseQuestion.prompt;
    }

    const payload = (await response.json()) as {
      output_text?: string;
      output?: Array<{ content?: Array<{ text?: string }> }>;
    };

    return (
      payload.output_text?.trim() ||
      payload.output?.[0]?.content?.[0]?.text?.trim() ||
      baseQuestion.prompt
    );
  } catch {
    return baseQuestion.prompt;
  }
}

export async function dramaticReveal(player: Player) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return `I can feel it now. The player in your mind is ${player.name}.`;
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "Write a dramatic reveal line for a cricket stadium guessing game. Keep it to one sentence."
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Player: ${player.name}, Team: ${player.teamId.toUpperCase()}, Role: ${player.role}`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      return `I can feel it now. The player in your mind is ${player.name}.`;
    }

    const payload = (await response.json()) as {
      output_text?: string;
      output?: Array<{ content?: Array<{ text?: string }> }>;
    };

    return (
      payload.output_text?.trim() ||
      payload.output?.[0]?.content?.[0]?.text?.trim() ||
      `I can feel it now. The player in your mind is ${player.name}.`
    );
  } catch {
    return `I can feel it now. The player in your mind is ${player.name}.`;
  }
}
