import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api-internhasha.wafflestudio.com',
  timeout: 5000,
});

export type ApplicantProfilePayload = {
  enrollYear: number;
  department: string;
  cvKey: string;
};

type ServerApplicantPayload = {
  enrollYear: number;
  department: string;
  positions: string[];
  slogan: string;
  explanation: string;
  stacks: string[];
  imageKey: string;
  cvKey: string;
  portfolioKey: string;
  links: { description: string; link: string }[];
};

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
