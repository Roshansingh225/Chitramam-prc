import { PageShell } from "@/components/layout/page-shell";
import { GameShell } from "@/components/game/game-shell";
import { getPlayers, getQuestions } from "@/lib/server/store";
import { TeamId } from "@/types";

export const dynamic = "force-dynamic";

interface PlayPageProps {
  searchParams?: Promise<{
    team?: TeamId;
    mode?: string;
  }>;
}

export default async function PlayPage({ searchParams }: PlayPageProps) {
  const [players, questions, resolvedSearch] = await Promise.all([getPlayers(), getQuestions(), searchParams]);

  return (
    <PageShell>
      <GameShell players={players} questions={questions} initialTeamId={resolvedSearch?.team} mode={resolvedSearch?.mode} />
    </PageShell>
  );
}
