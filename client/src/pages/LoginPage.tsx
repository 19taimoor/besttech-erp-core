import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { InputField } from "../components/ui/FormField";
import { Button } from "../components/ui/Button";
import { extractErrorMessage } from "../api/client";
import "./LoginPage.css";

const DEV_AUTO_LOGIN = import.meta.env.VITE_DEV_AUTO_LOGIN === "true";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(DEV_AUTO_LOGIN ? "admin@besttech.com" : "");
  const [password, setPassword] = useState(DEV_AUTO_LOGIN ? "Admin@123" : "");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Email is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back!");
      const redirectTo = (location.state as { from?: string })?.from ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(extractErrorMessage(error, "Invalid email or password"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <span className="login-brand-mark">B</span>
          <span>BestTech ERP Core</span>
        </div>
        <h1>Sign in</h1>
        <p className="login-subtitle">Enter your credentials to access the dashboard.</p>

        {formError && <div className="login-error">{formError}</div>}

        <InputField
          label="Email"
          type="email"
          name="email"
          autoComplete="username"
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" isLoading={isSubmitting} style={{ width: "100%" }}>
          Sign in
        </Button>
      </form>
    </div>
  );
}
