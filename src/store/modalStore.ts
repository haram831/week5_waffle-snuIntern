import { create } from 'zustand';

type ModalState = {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
};

// 로그인 모달 처리용 Zustand 스토어
// 상세페이지에서도 로그인 모달을 띄워야해서 전역스토어로 관리
const useModalStore = create<ModalState>((set) => ({
  isLoginModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));

export default useModalStore;