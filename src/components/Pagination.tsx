import { useEffect, useState } from 'react';

interface Props {
    totalItems: number;
    itemPerPage: number;
    pageCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    prevPageText?: string;
    nextPageText?: string;
}

export default function Pagination({
    totalItems,
    itemPerPage,
    pageCount,
    currentPage,
    onPageChange,
    prevPageText = '<',
    nextPageText = '>',
}: Props) {
    const totalPages = Math.ceil(totalItems / itemPerPage);
    const [start, setStart] = useState(1);
    const noPrev = start === 1;
    const noNext = start + pageCount - 1 >= totalPages;

    useEffect(() => {
        if (currentPage === start + pageCount) setStart((prev) => prev + pageCount);
        else if (currentPage < start) setStart(Math.max(1, start - pageCount));
    }, [currentPage, start, pageCount]);

    return(
        <div>
            <ul>
                <li>
                    {noPrev ? (<span>{prevPageText}</span>) : (<button onClick={() => onPageChange(start - 1)}>{prevPageText}</button>)}
                </li>
                {[...Array(pageCount)].map((_, idx) => (
                    <>
                        {start + idx <= totalPages && (
                            <li key={idx}>
                                <button onClick={() => onPageChange(start + idx)}>
                                    {start + idx}
                                </button>
                            </li>
                        )}
                    </>
                ))}
                <li>
                    {noNext ? (<span>{nextPageText}</span>) : (<button onClick={() => onPageChange(start + pageCount)}>{nextPageText}</button>)}
                </li>
            </ul>
        </div>
    )
}