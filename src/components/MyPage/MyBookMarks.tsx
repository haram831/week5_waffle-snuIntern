import { useEffect, useState } from 'react';
import { BsBookmarkFill } from 'react-icons/bs';
import type { JobInfo as BookMark, DeadlineInfo } from '../../@types/job';
import { getBookmarks } from '../../api/bookmark';
import styles from './MyBookMarks.module.css';

const MyBookMarks = () => {
  const [bookMarkList, setBookMarkList] = useState<BookMark[]>([]);
  const getDeadlineInfo = (endDate: string | null): DeadlineInfo => {
    if (endDate === null) {
      return { text: '상시모집', status: 'default' };
    }
    const now = new Date();
    const endDateObj = new Date(endDate);
    if (endDateObj < now) {
      return { text: '마감', status: 'closed' };
    }
    const diffMs = endDateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return { text: `D-${diffDays}`, status: 'default' };
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const bookmarks = await getBookmarks();
        setBookMarkList(bookmarks.posts);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {bookMarkList.map((bookmark) => {
          const { text, status } = getDeadlineInfo(bookmark.employmentEndDate);

          return (
            <li key={bookmark.id} className={styles.card}>
              <div className={styles.leftGroup}>
                <div className={styles.iconWrapper}>
                  <BsBookmarkFill />
                </div>
                <span className={styles.companyName}>
                  {bookmark.companyName}
                </span>
              </div>

              <div className={styles.rightGroup}>
                <span className={styles.positionTitle}>
                  {bookmark.positionTitle}
                </span>
                <span className={`${styles.deadline} ${styles[status]}`}>
                  {text}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyBookMarks;
