import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "../../components/ui/Card";
import { createUser } from "../../api/users";
import { UserForm, UserFormValues } from "./UserForm";

export default function UserCreatePage() {
  const navigate = useNavigate();

  async function handleSubmit(values: UserFormValues) {
    await createUser({
      name: values.name,
      email: values.email,
      password: values.password,
      roleId: Number(values.roleId),
      phone: values.phone || null,
      status: values.status,
    });
    toast.success("User created successfully");
    navigate("/users");
  }

  return (
    <div>
      <PageHeader title="New user" description="Create a new internal user account." />
      <UserForm onSubmit={handleSubmit} submitLabel="Create user" />
    </div>
  );
}
