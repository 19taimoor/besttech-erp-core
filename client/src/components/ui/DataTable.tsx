import { ReactNode } from "react";
import { Skeleton, EmptyState, ErrorState } from "./States";
import "./DataTable.css";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  sort?: { column: string; direction: "asc" | "desc" };
  onSortChange?: (column: string) => void;
  skeletonRows?: number;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  error,
  onRetry,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  sort,
  onSortChange,
  skeletonRows = 5,
}: DataTableProps<T>) {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry ?? (() => {})} />;
  }

  if (!isLoading && rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sort?.column === col.key;
              return (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={col.sortable ? "sortable" : ""}
                  onClick={col.sortable ? () => onSortChange?.(col.key) : undefined}
                >
                  {col.header}
                  {isSorted && <span className="sort-indicator">{sort?.direction === "asc" ? " ↑" : " ↓"}</span>}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      <Skeleton height={14} />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr key={rowKey(row)}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render(row)}</td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
