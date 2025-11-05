import axios from 'axios';
import type { JobListResponse } from '../@types/job.d.ts';
import { encodeQueryParams } from './encodeQueryParams';

export const fetchJobList = async (
  roles?: string[],
  isActive?: boolean,
  domains?: string[],
  page?: number,
  order?: 0 | 1
): Promise<JobListResponse> => {
  const baseUrl = 'https://api-internhasha.wafflestudio.com/api/post';
  const queryString = encodeQueryParams({
    params: {
      roles: roles,
      isActive: isActive,
      domains: domains,
      page: page,
      order: order,
    },
  });
  const url = `${baseUrl}?${queryString}`;

  // 헤더에 로그인 토큰을 넣어야해서 수정
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };

  // localStorage에서 토큰을 가져오기
  const token = localStorage.getItem('authToken');

  if (token) {
    // 토큰이 있으면 header에 추가
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios.get(url, {
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error("공고 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};
