import styles from "./Pagination.module.css";

type PageItem = number | "...";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    const pages: PageItem[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPageItems(currentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Paginación">
      <button
        type="button"
        className={`${styles.btn} ${styles.btnArrow}`}
        aria-label="Página anterior"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &laquo;
      </button>

      {items.map((item, index) => {
        if (item === "...") {
          return (
            <span key={`dots-${index}`} className={styles.dots} aria-hidden="true">
              &hellip;
            </span>
          );
        }

        const isActive = item === currentPage;

        return (
          <button
            key={item}
            type="button"
            className={`${styles.btn} ${isActive ? styles.btnActive : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        className={`${styles.btn} ${styles.btnArrow}`}
        aria-label="Página siguiente"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &raquo;
      </button>
    </nav>
  );
}
