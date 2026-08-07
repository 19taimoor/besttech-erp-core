import { PaginationMeta } from "../../types";
import { Button } from "./Button";
import "./Pagination.css";

export function Pagination({ meta, onPageChange }: { meta: PaginationMeta; onPageChange: (page: number) => void }) {
  const { current_page, last_page, total, per_page } = meta;
  const from = total === 0 ? 0 : (current_page - 1) * per_page + 1;
  const to = Math.min(current_page * per_page, total);

  return (
    <div className="pagination">
      <span className="pagination-summary">
        {total === 0 ? "No results" : `Showing ${from}-${to} of ${total}`}
      </span>
      <div className="pagination-controls">
        <Button variant="secondary" disabled={current_page <= 1} onClick={() => onPageChange(current_page - 1)}>
          Previous
        </Button>
        <span className="pagination-page">
          Page {current_page} of {last_page}
        </span>
        <Button
          variant="secondary"
          disabled={current_page >= last_page}
          onClick={() => onPageChange(current_page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
