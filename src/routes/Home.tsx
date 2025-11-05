import JobContainer from '../components/JobContainer';
import styles from './Home.module.css';

function Home() {
  return (
    <main className={styles.container}>
      <span>Home Page</span>
      <JobContainer />
    </main>
  );
}
export default Home;
