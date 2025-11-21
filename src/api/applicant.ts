export type ApplicantProfilePayload = {
  enrollYear: number;
  department: string;
  cvKey: string;
};

export const putApplicantMe = async (payload: ApplicantProfilePayload) => {
  const res = await fetch('/api/applicant/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('failed to update applicant profile');
  }

  return res.json();
};
