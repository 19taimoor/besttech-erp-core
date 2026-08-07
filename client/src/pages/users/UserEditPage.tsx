import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "../../components/ui/Card";
import { ErrorState, Skeleton } from "../../components/ui/States";
import { getUser, updateUser } from "../../api/users";
import { extractErrorMessage } from "../../api/client";
import { User } from "../../types";
import { UserForm, UserFormValues, userToFormValues } from "./UserForm";

export default function UserEditPage() {
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

  async function handleSubmit(values: UserFormValues) {
    if (!id) return;
    await updateUser(Number(id), {
      name: values.name,
      email: values.email,
      ...(values.password ? { password: values.password } : {}),
      roleId: Number(values.roleId),
      phone: values.phone || null,
      status: values.status,
    });
    toast.success("User updated successfully");
    navigate("/users");
  }

  return (
    <div>
      <PageHeader title="Edit user" description="Update this user's details and access." />
      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : isLoading || !user ? (
        <Skeleton height={400} />
      ) : (
        <UserForm initialValues={userToFormValues(user)} isEdit onSubmit={handleSubmit} submitLabel="Save changes" />
      )}
    </div>
  );
}
