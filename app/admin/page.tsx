import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { PageShell } from "@/components/layout/page-shell";
import { getPlayers, getQuestions } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [players, questions] = await Promise.all([getPlayers(), getQuestions()]);

  return (
    <PageShell>
      <AdminDashboard initialPlayers={players} initialQuestions={questions} />
    </PageShell>
  );
}
