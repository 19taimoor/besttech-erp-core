import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/dashboard";
import { extractErrorMessage } from "../api/client";
import { DashboardStats } from "../types";
import { Card, PageHeader } from "../components/ui/Card";
import { Skeleton, ErrorState } from "../components/ui/States";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setIsLoading(true);
    setError(null);
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(extractErrorMessage(err, "Could not load dashboard stats")))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of your workspace." />

      {error ? (
        <Card className="dashboard-error-card">
          <ErrorState message={error} onRetry={load} />
        </Card>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Total users" value={stats?.totalUsers} isLoading={isLoading} />
            <StatCard label="Active users" value={stats?.activeUsers} isLoading={isLoading} />
            <StatCard label="Roles" value={stats?.totalRoles} isLoading={isLoading} />
            <StatCard label="Low-stock alerts" value={stats?.inventory.lowStockItems} isLoading={isLoading} />
          </div>

          <Card className="dashboard-activity">
            <div className="dashboard-activity-header">
              <h2>Recent activity</h2>
            </div>
            <div className="dashboard-placeholder">
              <p>Stock movements, CRM activity, and shipment updates will show up here once those modules ship.</p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, isLoading }: { label: string; value: number | undefined; isLoading: boolean }) {
  return (
    <Card className="stat-card">
      <span className="stat-card-label">{label}</span>
      {isLoading ? <Skeleton height={28} width="60%" /> : <span className="stat-card-value">{value ?? 0}</span>}
    </Card>
  );
}
