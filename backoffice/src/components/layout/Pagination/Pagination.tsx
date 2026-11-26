import styles from "./Pagination.module.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: Readonly<PaginationProps>) {
  if (totalPages <= 1) {
    return null;
  }

  // [1, 2, ..., totalPages]
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.pagination} aria-label="Paginación">
      {/* "Anterior" only from page 2 on, like the design */}
      {currentPage > 1 && (
        <button type="button" className={styles.btn} onClick={() => onPageChange(currentPage - 1)}>
          ← Anterior
        </button>
      )}

      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            className={`${styles.btn} ${isActive ? styles.btnActive : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      {/* "Siguiente" only until the last page */}
      {currentPage < totalPages && (
        <button type="button" className={styles.btn} onClick={() => onPageChange(currentPage + 1)}>
          Siguiente →
        </button>
      )}
    </nav>
  );
}
