import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api-internhasha.wafflestudio.com',
  timeout: 5000,
});

// 찜하기 (POST) API 함수
// Response가 없으므로, 함수의 리턴 타입을 Promise<void>로 지정
export const addBookmark = async (postId: string): Promise<void> => {
  const token = localStorage.getItem('authToken');

  if (!token) throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');

  // await만 사용
  await apiClient.post(
    `/api/post/${postId}/bookmark`,
    null, // POST 요청이지만 Request Body가 없으므로 null 전달
    {
      headers: {
        Authorization: `Bearer ${token}`, // JWT 헤더 설정
      },
    }
  );
};

// 찜하기 해제 (DELETE) APi 함수
// Response가 없으므로, 함수의 리턴 타입을 Promise<void>로 지정
export const removeBookmark = async (postId: string): Promise<void> => {
  const token = localStorage.getItem('authToken');

  if (!token) throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');

  // await만 사용
  await apiClient.delete(`/api/post/${postId}/bookmark`, {
    headers: {
      Authorization: `Bearer ${token}`, // JWT 헤더 설정
    },
  });
};