import styles from './Pagination.module.css';

interface Props {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  prevPageText?: string;
  nextPageText?: string;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
  prevPageText = '<',
  nextPageText = '>',
}: Props) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const noPrev = currentPage <= 1;
  const noNext = currentPage >= pageCount;

  return (
    <div className={styles.container}>
      <ul className={styles.list} role="navigation" aria-label="페이지네이션">
        <li className={styles.item}>
          <button
            type="button"
            className={`${styles.arrow} ${noPrev ? styles.disabled : ''}`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={noPrev}
            aria-label="이전 페이지"
          >
            {prevPageText}
          </button>
        </li>

        {pages.map((page) => (
          <li key={page} className={styles.item}>
            <button
              type="button"
              className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`${page}페이지`}
            >
              {page}
            </button>
          </li>
        ))}

        <li className={styles.item}>
          <button
            type="button"
            className={`${styles.arrow} ${noNext ? styles.disabled : ''}`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={noNext}
            aria-label="다음 페이지"
          >
            {nextPageText}
          </button>
        </li>
      </ul>
    </div>
  );
}
