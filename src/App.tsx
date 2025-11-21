import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './routes/Home';
import Login from './routes/Login';
import MyPage from './routes/MyPage';
import ProfileCreate from './routes/ProfileCreate';
import Signup from './routes/Signup';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="profile/create" element={<ProfileCreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
