import JobContainer from '../components/JobContainer';
import MyBookMarks from '../components/MyPage/MyBookMarks';
import styles from './Home.module.css';

function Home() {
  return (
    <main className={styles.container}>
      <JobContainer />
      <MyBookMarks />
    </main>
  );
}
export default Home;
