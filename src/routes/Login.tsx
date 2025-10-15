import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin, getUserInfo } from '../api/auth';
import useAuthStore from '../store/authStroe';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // form 제출 시 페이지 새로고침 발생 방지

    const fullEmail = `${email}@snu.ac.kr`;

    try {
      // 로그인 API 호출, zustand 스토어 login 함수가 있어서 이름 변경
      const { token } = await apiLogin({ email: fullEmail, password });

      // 받은 토큰을 localStorage에 저장
      localStorage.setItem('authToken', token);

      // 토큰을 이용해 유저 정보 요청
      const userProfile = await getUserInfo();

      // global state에 유저 정보로 로그인 상태 업데이트
      storeLogin(userProfile.name);

      // 로그인 성공 후 홈으로 이동
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>로그인</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <div className={styles.inputContainer}>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <span className={styles.emailSuffix}>@snu.ac.kr</span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            비밀번호
          </label>
          <div className={styles.inputContainer}>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
        </div>

        <button type="submit" className={styles.loginButton}>
          로그인
        </button>
      </form>

      <div className={styles.signupPrompt}>
        <span>아직 계정이 없으신가요?</span>
        <Link to="/signup" className={styles.signupLink}>
          회원가입
        </Link>
      </div>
    </div>
  );
}

export default Login;
