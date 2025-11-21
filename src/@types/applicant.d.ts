export interface ApplicantProfile {
  id: string;
  name: string;
  email: string;
  enrollYear: number;
  department: string;
  cvKey: string;
}

export type ApplicantProfilePayload = {
  enrollYear: number;
  department: string;
  cvKey: string;
};

export type ServerApplicantPayload = {
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
