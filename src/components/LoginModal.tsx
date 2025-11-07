import React from 'react';
import { useNavigate } from 'react-router-dom';
import useModalStore from '../store/modalStore';
import styles from './LoginModal.module.css';

const LoginModal: React.FC = () => {
  // 모달을 닫는 함수 global state에서 가져오기
  const { closeLoginModal } = useModalStore();

  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login'); // '/login' 경로로 이동
    closeLoginModal(); // 이동 후 모달 닫기
  };

  // 배경(backdrop) 클릭 시 모달 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    // e.target: 실제 클릭된 요소
    // e.currentTarget: 이벤트 리스너가 달린 요소 (여기선 .backdrop)
    // 모달 콘텐츠(흰색 박스)가 아닌 배경(회색 영역)을 클릭했을 때만 닫히도록 함
    if (e.target === e.currentTarget) {
      closeLoginModal();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <h2>로그인이 필요합니다</h2>
        <p>북마크 기능을 사용하려면 로그인이 필요합니다.</p>

        <div className={styles.buttons}>
          <button
            onClick={closeLoginModal}
            className={`${styles.button} ${styles.closeButton}`}
          >
            닫기
          </button>
          <button
            onClick={handleGoToLogin}
            className={`${styles.button} ${styles.loginButton}`}
          >
            로그인 하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
