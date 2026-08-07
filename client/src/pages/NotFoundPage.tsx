import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/dashboard">Back to dashboard</Link>
    </div>
  );
}
