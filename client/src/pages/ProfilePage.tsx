import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { PageHeader, Card } from "../components/ui/Card";
import { InputField } from "../components/ui/FormField";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import * as authApi from "../api/auth";
import { extractErrorMessage, extractFieldErrors } from "../api/client";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const updated = await authApi.updateProfile({
        name,
        phone: phone || null,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });
      setUser(updated);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Profile updated");
    } catch (error) {
      const fieldErrors = extractFieldErrors(error);
      if (fieldErrors) {
        setErrors(fieldErrors);
      } else {
        toast.error(extractErrorMessage(error, "Could not update profile"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="My profile" description="Update your own details and password." />

      <Card className="profile-card">
        <div className="profile-summary">
          <span className="profile-avatar">{user.name.charAt(0).toUpperCase()}</span>
          <div>
            <p className="profile-name">{user.name}</p>
            <p className="profile-email">{user.email}</p>
          </div>
          <Badge tone="accent">{user.role.displayName}</Badge>
        </div>

        <form onSubmit={handleSubmit}>
          <InputField label="Full name" value={name} error={errors.name?.[0]} onChange={(e) => setName(e.target.value)} />
          <InputField label="Phone" value={phone} error={errors.phone?.[0]} onChange={(e) => setPhone(e.target.value)} />

          <hr className="profile-divider" />
          <p className="profile-section-title">Change password</p>

          <InputField
            label="Current password"
            type="password"
            value={currentPassword}
            error={errors.currentPassword?.[0]}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <InputField
            label="New password"
            type="password"
            value={newPassword}
            error={errors.newPassword?.[0]}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <div className="profile-actions">
            <Button type="submit" isLoading={isSubmitting}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
