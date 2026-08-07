import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader, Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ErrorState, Skeleton } from "../../components/ui/States";
import { Button } from "../../components/ui/Button";
import { getUser } from "../../api/users";
import { extractErrorMessage } from "../../api/client";
import { User } from "../../types";
import "./UserDetailPage.css";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    getUser(Number(id))
      .then(setUser)
      .catch((err) => setError(extractErrorMessage(err, "Could not load user")))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, [id]);

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (isLoading || !user) {
    return <Skeleton height={200} />;
  }

  return (
    <div>
      <PageHeader
        title={user.name}
        description={user.email}
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate("/users")}>
              Back to users
            </Button>
            <Button onClick={() => navigate(`/users/${user.id}/edit`)}>Edit</Button>
          </>
        }
      />
      <Card className="user-detail-card">
        <dl className="user-detail-grid">
          <div>
            <dt>Role</dt>
            <dd>{user.role.displayName}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <Badge tone={user.status === "active" ? "success" : "neutral"}>{user.status}</Badge>
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{user.phone ?? "—"}</dd>
          </div>
          <div>
            <dt>Last login</dt>
            <dd>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </Card>
      <p className="user-detail-back">
        <Link to="/users">← All users</Link>
      </p>
    </div>
  );
}
