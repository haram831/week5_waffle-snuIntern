import { useEffect, useState } from 'react';
import { BsBookmarkFill } from 'react-icons/bs';
import type { JobInfo as BookMark, DeadlineInfo } from '../../@types/job';
import { getBookmarks } from '../../api/bookmark';
import styles from './MyBookMarks.module.css';

const MyBookMarks = () => {
  const [bookMarkList, setBookMarkList] = useState<BookMark[]>([]);
  const getDeadlineInfo = (endDate: string | null): DeadlineInfo => {
    if (endDate === null) {
      return { text: '상시 채용', status: 'default' };
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
    <div>
      <h2>My Bookmarks</h2>
      <ul>
        {bookMarkList.map((bookmark) => (
          <li key={bookmark.id}>
            <div>
              <BsBookmarkFill />
              <h2>{bookmark.companyName}</h2>
              <p>{bookmark.positionTitle}</p>
              <div
                className={`${styles.jobCardDeadline} ${styles[getDeadlineInfo(bookmark.employmentEndDate).status]}`}
              >
                {getDeadlineInfo(bookmark.employmentEndDate).text}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookMarks;
