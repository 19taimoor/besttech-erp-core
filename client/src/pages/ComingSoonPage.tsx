import { EmptyState } from "../components/ui/States";
import { PageHeader } from "../components/ui/Card";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <EmptyState
        title="Coming soon"
        description={`${title} is planned for a future phase. The database schema is already in place, but there's no interface for it yet.`}
      />
    </div>
  );
}
