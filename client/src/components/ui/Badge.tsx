import { ReactNode } from "react";
import "./Badge.css";

type Tone = "neutral" | "success" | "danger" | "accent";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
