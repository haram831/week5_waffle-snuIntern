// 로그인 시 필요한 데이터 타입
export interface UserCredentials {
  email: string;
  password: string;
}

// 회원가입 시 필요한 데이터 타입
export interface SignUpInfo extends UserCredentials {
  name: string;
}

// 로그인/회원가입 성공 시 서버 응답 타입
export interface AuthResponse {
  user: {
    id: string;
    userRole: string;
  };
  token: string;
}

// 유저 정보 조회 시 서버 응답 타입
export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userRole: string;
  email: string;
}
