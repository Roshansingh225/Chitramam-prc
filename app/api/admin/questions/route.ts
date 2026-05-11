import { NextRequest, NextResponse } from "next/server";

import { getQuestions, saveQuestions } from "@/lib/server/store";
import { QuestionDefinition } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as QuestionDefinition;
  const questions = await getQuestions();
  const updatedQuestions = [...questions.filter((question) => question.id !== body.id), body];
  await saveQuestions(updatedQuestions);
  return NextResponse.json(updatedQuestions);
}
