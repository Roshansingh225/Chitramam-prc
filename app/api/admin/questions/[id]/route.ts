import { NextRequest, NextResponse } from "next/server";

import { getQuestions, saveQuestions } from "@/lib/server/store";
import { QuestionDefinition } from "@/types";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as QuestionDefinition;
  const questions = await getQuestions();
  const updatedQuestions = questions.map((question) => (question.id === id ? { ...question, ...body } : question));
  await saveQuestions(updatedQuestions);
  return NextResponse.json(updatedQuestions);
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const questions = await getQuestions();
  const updatedQuestions = questions.filter((question) => question.id !== id);
  await saveQuestions(updatedQuestions);
  return NextResponse.json(updatedQuestions);
}
