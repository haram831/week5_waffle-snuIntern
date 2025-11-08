import JobContainer from '../components/JobContainer';
import styles from './Home.module.css';

function Home() {
  return (
    <main className={styles.container}>
      <JobContainer />
    </main>
  );
}
export default Home;
