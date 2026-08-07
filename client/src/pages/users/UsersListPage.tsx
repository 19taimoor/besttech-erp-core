import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { DataTable, Column } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import { ConfirmModal } from "../../components/ui/Modal";
import { deleteUser, listUsers } from "../../api/users";
import { listRoles } from "../../api/roles";
import { extractErrorMessage } from "../../api/client";
import { PaginationMeta, Role, User } from "../../types";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import "./UsersListPage.css";

const DEFAULT_META: PaginationMeta = { current_page: 1, per_page: 15, total: 0, last_page: 1 };

export default function UsersListPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" }>({
    column: "createdAt",
    direction: "desc",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    listRoles()
      .then(setRoles)
      .catch(() => setRoles([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter, statusFilter]);

  function load() {
    setIsLoading(true);
    setError(null);
    listUsers({
      search: debouncedSearch || undefined,
      role: roleFilter || undefined,
      status: (statusFilter as "active" | "inactive") || undefined,
      page,
      sort: sort.column as "name" | "email" | "createdAt" | "lastLoginAt",
      direction: sort.direction,
    })
      .then((res) => {
        setUsers(res.data);
        setMeta(res.meta);
      })
      .catch((err) => setError(extractErrorMessage(err, "Could not load users")))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, [debouncedSearch, roleFilter, statusFilter, page, sort]);

  function handleSortChange(column: string) {
    setSort((prev) =>
      prev.column === column ? { column, direction: prev.direction === "asc" ? "desc" : "asc" } : { column, direction: "asc" }
    );
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      toast.success("User deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not delete user"));
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<User>[] = [
    { key: "name", header: "Name", sortable: true, render: (u) => u.name },
    { key: "email", header: "Email", sortable: true, render: (u) => u.email },
    { key: "role", header: "Role", render: (u) => <Badge tone="accent">{u.role.displayName}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (u) => <Badge tone={u.status === "active" ? "success" : "neutral"}>{u.status}</Badge>,
    },
    {
      key: "lastLoginAt",
      header: "Last login",
      sortable: true,
      render: (u) => (u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never"),
    },
    {
      key: "actions",
      header: "",
      width: "160px",
      render: (u) => (
        <div className="users-row-actions">
          <button className="link-action" onClick={() => navigate(`/users/${u.id}`)}>
            View
          </button>
          <button className="link-action" onClick={() => navigate(`/users/${u.id}/edit`)}>
            Edit
          </button>
          <button className="link-action link-action-danger" onClick={() => setDeleteTarget(u)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage internal accounts and access."
        actions={<Button onClick={() => navigate("/users/new")}>New user</Button>}
      />

      <div className="users-filters">
        <input
          className="users-search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {r.displayName}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="users-table-card">
        <DataTable
          columns={columns}
          rows={users}
          rowKey={(u) => u.id}
          isLoading={isLoading}
          error={error}
          onRetry={load}
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search or filters, or create a new user."
          sort={sort}
          onSortChange={handleSortChange}
        />
        {!isLoading && !error && users.length > 0 && <Pagination meta={meta} onPageChange={setPage} />}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete user"
          message={
            <>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This can be undone by
              restoring the record later, but they will lose access immediately.
            </>
          }
          confirmLabel="Delete"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
