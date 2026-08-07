import { ReactNode } from "react";
import { Button } from "./Button";
import "./States.css";

export function Skeleton({ height = 16, width = "100%" }: { height?: number; width?: string | number }) {
  return <div className="skeleton" style={{ height, width }} />;
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="state-block">
      <p className="state-title">{title}</p>
      {description && <p className="state-description">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state-block state-error">
      <p className="state-title">Something went wrong</p>
      <p className="state-description">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
