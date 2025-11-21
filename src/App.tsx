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

          {/* 프로필 생성 및 수정 경로 통합 */}
          <Route path="mypage/create-profile" element={<ProfileCreate />} />
          <Route path="mypage/edit-profile" element={<ProfileCreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
