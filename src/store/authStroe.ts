import { create } from 'zustand';

type AuthState = {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
};

// create 함수를 사용하여 Zustand 스토어 생성(global state)
//
// const { isLoggedIn, username, logout } = useAuthStore();
// 이런식으로 다른 컴포넌트에서 global state 사용 가능
const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  username: null,

  // 로그인 액션: 유저 이름을 받고 로그인 상태로 변경
  login: (name) => {
    set({
      isLoggedIn: true,
      username: name,
    });
  },

  // 로그아웃 액션: 모든 상태를 초기화
  logout: () => {
    set({
      isLoggedIn: false,
      username: null,
    });
  },
}));

export default useAuthStore;
