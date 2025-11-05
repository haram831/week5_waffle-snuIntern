import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaTimesCircle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, login, signup } from '../api/auth';
import useAuthStore from '../store/authStroe';
import styles from './Signup.module.css';

function Signup() {
  // 회원가입 후 자동 로그인 처리
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  // 폼 상태
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  // UX용 상태
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 제출 가능 여부
  const canSubmit =
    username.trim().length > 0 &&
    password.length > 0 &&
    password === passwordConfirm &&
    email.trim().length > 0;

  useEffect(() => {
    setShowGuide(password.length > 0 && password !== passwordConfirm);
  }, [password, passwordConfirm]);

  // 비밀번호 조건
  const passwordChecks = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUpperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
    noRepeated: !/(.)\1/.test(password), // 동일문자 반복 금지
  };

  type ServerError = {
    message?: string;
    error?: string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrMsg(null);
    setOkMsg(null);

    try {
      const fullEmail = `${email.trim()}@snu.ac.kr`;

      await signup({
        name: username.trim(),
        email: fullEmail,
        password,
      });

      const authRes = await login({
        email: fullEmail,
        password,
      });

      // 3) 토큰 저장
      const token = authRes.token;

      if (!token) {
        throw new Error(
          '서버 응답에 토큰이 없습니다. AuthResponse의 토큰 필드명을 확인하세요.'
        );
      }
      localStorage.setItem('authToken', token);

      try {
        const me = await getUserInfo();
        storeLogin(me.name);
      } catch (err) {
        console.warn('getUserInfo failed', err);
        // 유저 정보 실패해도 토큰이 있으면 다음 단계 진행
      }

      setOkMsg('회원가입 및 로그인에 성공했습니다!');
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axErr = err as AxiosError<ServerError>;
        const serverMsg =
          axErr.response?.data?.message ??
          axErr.response?.data?.error ??
          axErr.message; // 네트워크/타임아웃 등
        setErrMsg(serverMsg || '요청 처리 중 오류가 발생했습니다.');
      } else if (err instanceof Error) {
        setErrMsg(err.message);
      } else {
        setErrMsg('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="username">이름</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="name"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">비밀번호</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={styles.input}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {showGuide && (
          <div className={styles.guide}>
            <div>아래와 같이 비밀번호를 설정하면 더 안전해요!</div>
            <div className={styles.checkList}>
              <div>
                {passwordChecks.minLength ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}{' '}
                비밀번호 8자 이상
              </div>
              <div>
                {passwordChecks.hasNumber ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}{' '}
                숫자 포함
              </div>
              <div>
                {passwordChecks.hasUpperLower ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}{' '}
                영문 대소문자 포함
              </div>
              <div>
                {passwordChecks.hasSpecial ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}{' '}
                특수문자 포함
              </div>
              <div>
                {passwordChecks.noRepeated ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}{' '}
                연속된 문자열이나 숫자가 없어야 함
              </div>
            </div>
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              className={styles.input}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
            >
              {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="email">이메일</label>
          <div className={styles.emailWrapper}>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              className={styles.input}
            />
            <span className={styles.emailSuffix}>@snu.ac.kr</span>
          </div>
        </div>

        {errMsg && <p className={styles.error}>{errMsg}</p>}
        {okMsg && <p className={styles.success}>{okMsg}</p>}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={styles.submit}
        >
          {loading ? '처리 중…' : '회원가입'}
        </button>
      </form>
    </main>
  );
}

export default Signup;
