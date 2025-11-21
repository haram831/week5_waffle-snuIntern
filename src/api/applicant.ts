export type ApplicantProfilePayload = {
  enrollYear: number;
  department: string;
  cvKey: string;
};

export const putApplicantMe = async (payload: ApplicantProfilePayload) => {
  const token = localStorage.getItem('authToken');

  const res = await fetch('/api/applicant/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => '');
    console.error('putApplicantMe error', res.status, message);
    throw new Error('failed to update applicant profile');
  }

  return res.json();
};
