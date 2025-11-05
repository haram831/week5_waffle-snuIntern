interface Props {
  pageCount: number; // total number of pages
  currentPage: number; // current active page
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
    <div>
      <ul>
        <li>
          {noPrev ? (
            <span>{prevPageText}</span>
          ) : (
            <button onClick={() => onPageChange(currentPage - 1)}>
              {prevPageText}
            </button>
          )}
        </li>
        {pages.map(
          (page) =>
            page <= pageCount && (
              <li key={page}>
                <button onClick={() => onPageChange(page)}>{page}</button>
              </li>
            )
        )}
        <li>
          {noNext ? (
            <span>{nextPageText}</span>
          ) : (
            <button onClick={() => onPageChange(currentPage + 1)}>
              {nextPageText}
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}
