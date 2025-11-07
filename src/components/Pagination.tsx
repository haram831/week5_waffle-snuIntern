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
  const noPrev = currentPage === 1;
  const noNext = currentPage === pageCount;

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.item}>
          {noPrev ? (
            <span className={styles.disabled}>{prevPageText}</span>
          ) : (
            <button className={styles.arrow} onClick={() => onPageChange(currentPage - 1)}>
              {prevPageText}
            </button>
          )}
        </li>

        {pages.map(page => (
          <li key={page} className={styles.item}>
            <button
              className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        <li className={styles.item}>
          {noNext ? (
            <span className={styles.disabled}>{nextPageText}</span>
          ) : (
            <button className={styles.arrow} onClick={() => onPageChange(currentPage + 1)}>
              {nextPageText}
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}
