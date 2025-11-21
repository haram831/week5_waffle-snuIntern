import axios from 'axios';
import type {
  ApplicantProfile,
  ApplicantProfilePayload,
  ServerApplicantPayload,
} from '../@types/applicant';

const apiClient = axios.create({
  baseURL: 'https://api-internhasha.wafflestudio.com',
  timeout: 5000,
});

// 프로필 정보 조회 (GET) API 함수
export const getApplicantProfile = async (): Promise<ApplicantProfile> => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');

  const response = await apiClient.get<ApplicantProfile>('/api/applicant/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 프로필 정보 수정 (PUT) API 함수
export const putApplicantMe = async (payload: ApplicantProfilePayload) => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');

  const serverPayload: ServerApplicantPayload = {
    enrollYear: payload.enrollYear,
    department: payload.department,
    positions: [],
    slogan: '',
    explanation: '',
    stacks: [],
    imageKey: '',
    cvKey: payload.cvKey,
    portfolioKey: '',
    links: [],
  };

  const response = await apiClient.put('/api/applicant/me', serverPayload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data ?? null;
};
