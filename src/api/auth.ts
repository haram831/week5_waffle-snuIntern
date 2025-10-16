import axios from 'axios';
import type {
  AuthResponse,
  SignUpInfo,
  UserCredentials,
  UserProfile,
} from '../@types/auth';

// Axios 인스턴스 생성
// API를 호출할 때 전체 주소 대신 끝부분만 추가하면 됨
const apiClient = axios.create({
  baseURL: 'https://api-internhasha.wafflestudio.com',
  timeout: 5000,
});

// 회원가입을 요청하는 API 함수
// export const signup = async ({
//   name,
//   email,
//   password,
// }: SignUpInfo): Promise<AuthResponse> => {
//   const response = await apiClient.post<AuthResponse>('/api/auth/user', {
//     authType: 'APPLICANT',
//     info: {
//       type: 'APPLICANT',
//       name,
//       email,
//       password,
//       successCode: 'string',
//     },
//   });
//   return response.data;
// };

// 로그인을 요청하는 API 함수
export const login = async ({
  email,
  password,
}: UserCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    '/api/auth/user/session',
    {
      email,
      password,
    }
  );
  return response.data;
};

// 유저 정보를 조회하는 API 함수
export const getUserInfo = async (): Promise<UserProfile> => {
  // localStorage에서 토큰을 가져옴
  const token = localStorage.getItem('authToken');

  // 토큰이 없으면 에러 발생
  if (!token) throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');

  const response = await apiClient.get<UserProfile>('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
