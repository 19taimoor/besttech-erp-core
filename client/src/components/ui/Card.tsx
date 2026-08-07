import { ReactNode } from "react";
import "./Card.css";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className ?? ""}`}>{children}</div>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
