import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { InputField, SelectField } from "../../components/ui/FormField";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { listRoles } from "../../api/roles";
import { extractErrorMessage, extractFieldErrors } from "../../api/client";
import { Role, User } from "../../types";
import "./UserForm.css";

export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  roleId: string;
  phone: string;
  status: "active" | "inactive";
}

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  isEdit?: boolean;
  onSubmit: (values: UserFormValues) => Promise<void>;
  submitLabel: string;
}

const EMPTY_VALUES: UserFormValues = {
  name: "",
  email: "",
  password: "",
  roleId: "",
  phone: "",
  status: "active",
};

export function userToFormValues(user: User): UserFormValues {
  return {
    name: user.name,
    email: user.email,
    password: "",
    roleId: String(user.role.id),
    phone: user.phone ?? "",
    status: user.status,
  };
}

export function UserForm({ initialValues, isEdit, onSubmit, submitLabel }: UserFormProps) {
  const navigate = useNavigate();
  const [values, setValues] = useState<UserFormValues>({ ...EMPTY_VALUES, ...initialValues });
  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    listRoles()
      .then(setRoles)
      .catch((err) => setLoadError(extractErrorMessage(err, "Could not load roles")));
  }, []);

  function update<K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Record<string, string[]> {
    const next: Record<string, string[]> = {};
    if (values.name.trim().length < 2) next.name = ["Name must be at least 2 characters"];
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = ["A valid email is required"];
    if (!isEdit && values.password.length < 8) next.password = ["Password must be at least 8 characters"];
    if (isEdit && values.password && values.password.length < 8) next.password = ["Password must be at least 8 characters"];
    if (!values.roleId) next.roleId = ["A role is required"];
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      await onSubmit(values);
    } catch (error) {
      const fieldErrors = extractFieldErrors(error);
      if (fieldErrors) {
        setErrors(fieldErrors);
      } else {
        toast.error(extractErrorMessage(error, "Could not save user"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="user-form-card">
      <form onSubmit={handleSubmit} className="user-form">
        {loadError && <p className="form-load-error">{loadError}</p>}

        <InputField
          label="Full name"
          value={values.name}
          error={errors.name?.[0]}
          onChange={(e) => update("name", e.target.value)}
        />
        <InputField
          label="Email"
          type="email"
          value={values.email}
          error={errors.email?.[0]}
          onChange={(e) => update("email", e.target.value)}
        />
        <InputField
          label={isEdit ? "New password (leave blank to keep current)" : "Password"}
          type="password"
          value={values.password}
          error={errors.password?.[0]}
          onChange={(e) => update("password", e.target.value)}
        />
        <SelectField
          label="Role"
          value={values.roleId}
          error={errors.roleId?.[0]}
          placeholder="Select a role"
          options={roles.map((r) => ({ value: r.id, label: r.displayName }))}
          onChange={(e) => update("roleId", e.target.value)}
        />
        <InputField
          label="Phone (optional)"
          value={values.phone}
          error={errors.phone?.[0]}
          onChange={(e) => update("phone", e.target.value)}
        />
        <SelectField
          label="Status"
          value={values.status}
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          onChange={(e) => update("status", e.target.value as "active" | "inactive")}
        />

        <div className="user-form-actions">
          <Button type="button" variant="secondary" onClick={() => navigate("/users")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
