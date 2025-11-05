export interface Tag {
  tag: string;
}

export interface Author {
  id: string;
  name: string;
  profileImageKey: string;
}

export interface JobFilter {
  roles?: string[];
  isActive?: boolean;
  domains?: string[];
  page?: number;
  order?: 0 | 1;
}

export interface JobInfo {
  id: string;
  author: Author;
  companyName: string;
  profileImageKey: string;
  location: string;
  employmentEndDate: string | null;
  positionTitle: string;
  domain: string; // FINTECH, EDUCATION, etc
  slogan: string;
  detailSummary: string;
  positionType: string; // FRONT, BACKEND, MARKETING, APP 등
  headCount: number;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  coffeeChatCount: number;
}

export interface JobListResponse {
  posts: JobInfo[];
  paginator: {
    lastPage: number;
  };
}
