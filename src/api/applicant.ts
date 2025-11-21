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

  const res = await fetch('/api/applicant/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(serverPayload),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => '');
    console.error('putApplicantMe error', res.status, message);
    throw new Error('failed to update applicant profile');
  }

  const contentType = res.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  return null;
};
