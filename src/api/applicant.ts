import axios from 'axios';

// API 응답 (GET /api/applicant/me)
export interface ApplicantProfile {
  id: string;
  name: string;
  email: string;
  enrollYear: number; // 예: 2021
  department: string; // 예: "컴퓨터공학부,경영학과(복수전공)"
  // ... API가 반환하는 다른 필드들 ...
}

const apiClient = axios.create({
  baseURL: 'https://api-internhasha.wafflestudio.com',
  timeout: 5000,
});

/**
 * 내 프로필 정보 조회 (GET /api/applicant/me)
 * @returns ApplicantProfile
 */
export const getApplicantProfile = async (): Promise<ApplicantProfile> => {
  const token = localStorage.getItem('authToken'); // auth.ts에서 사용하던 토큰 키
  if (!token) throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');

  const response = await apiClient.get<ApplicantProfile>('/api/applicant/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};