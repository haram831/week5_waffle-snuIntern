import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { putApplicantMe } from '../api/applicant';
import type { ApplicantProfilePayload } from '../api/applicant';
import styles from './ProfileCreate.module.css';

type Errors = {
  enrollYear?: string;
  department?: string;
  cv?: string;
};

const MAX_SUB_MAJORS = 6;

const randomString = (length: number) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const buildCvKey = (fileName: string) => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;
  const rand = randomString(10);
  return `static/private/CV/${rand}_${dateStr}/${fileName}`;
};

const convertEnrollYear = (twoDigits: string): number => {
  const num = Number(twoDigits);
  return num <= 24 ? 2000 + num : 1900 + num;
};

const ProfileCreate = () => {
  const navigate = useNavigate();

  const [enrollYear, setEnrollYear] = useState('');
  const [departments, setDepartments] = useState<string[]>(['']);
  const [cvFileName, setCvFileName] = useState('');
  const [cvKey, setCvKey] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleEnrollYearChange = (value: string) => {
    if (value.length > 2) return;
    if (value !== '' && !/^\d+$/.test(value)) return;
    setEnrollYear(value);
    setErrors((prev) => ({ ...prev, enrollYear: undefined }));
  };

  const handleDepartmentChange = (index: number, value: string) => {
    setDepartments((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setErrors((prev) => ({ ...prev, department: undefined }));
  };

  const addDepartment = () => {
    if (departments.length >= 1 + MAX_SUB_MAJORS) return;
    setDepartments((prev) => [...prev, '']);
  };

  const removeDepartment = (index: number) => {
    if (index === 0) return;
    setDepartments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = file.name;
    const size = file.size;

    if (!name.toLowerCase().endsWith('.pdf')) {
      setErrors((prev) => ({
        ...prev,
        cv: 'PDF 파일만 업로드 가능합니다.',
      }));
      setCvFileName('');
      setCvKey('');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        cv: '5MB 이하의 PDF 파일만 업로드 가능합니다.',
      }));
      setCvFileName('');
      setCvKey('');
      return;
    }

    setErrors((prev) => ({ ...prev, cv: undefined }));
    setCvFileName(name);
    setCvKey(buildCvKey(name));
  };

  const clearFile = () => {
    setCvFileName('');
    setCvKey('');
    setErrors((prev) => ({ ...prev, cv: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!/^\d{2}$/.test(enrollYear)) {
      newErrors.enrollYear = '두 자리 수 숫자로 작성해주세요. (e.g. 25)';
    }

    const trimmed = departments.map((d) => d.trim());
    if (!trimmed[0]) {
      newErrors.department = '주전공 학과명을 작성해주세요.';
    } else {
      const nonEmpty = trimmed.filter((d) => d !== '');
      if (nonEmpty.length > 1 + MAX_SUB_MAJORS) {
        newErrors.department =
          '다전공은 총 6개 이하로 중복되지 않게 입력해주세요.';
      } else {
        const set = new Set(nonEmpty);
        if (set.size !== nonEmpty.length) {
          newErrors.department = '학과를 중복하여 작성하지 말아주세요.';
        }
      }
    }

    if (!cvKey) {
      newErrors.cv = '이력서(PDF)를 업로드해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: ApplicantProfilePayload = {
      enrollYear: convertEnrollYear(enrollYear),
      department: departments
        .map((d) => d.trim())
        .filter((d) => d !== '')
        .join(','),
      cvKey,
    };

    try {
      setIsSubmitting(true);
      await putApplicantMe(payload);
      alert('프로필이 저장되었습니다.');
      navigate('/mypage?tab=info');
    } catch {
      alert('프로필 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <h1 className={styles.title}>프로필 생성</h1>
        <p className={styles.subtitle} />
      </div>

      <div className={styles.right}>
        <h2 className={styles.formTitle}>필수 작성 항목</h2>
        <p className={styles.formDesc}>아래 항목은 필수로 작성해주세요.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>
              학번 <span className={styles.required}>*</span>
            </label>
            <div className={styles.inline}>
              <input
                className={styles.input}
                value={enrollYear}
                onChange={(e) => handleEnrollYearChange(e.target.value)}
                placeholder="25"
              />
              <span className={styles.inlineSuffix}>학번</span>
            </div>
            {errors.enrollYear ? (
              <p className={styles.error}>{errors.enrollYear}</p>
            ) : (
              <p className={styles.helper}>
                두 자리 수 숫자로 작성해주세요. (e.g. 25)
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              학과 <span className={styles.required}>*</span>
            </label>

            {departments.map((dept, index) => (
              <div key={index} className={styles.departmentRow}>
                <input
                  className={styles.input}
                  value={dept}
                  onChange={(e) =>
                    handleDepartmentChange(index, e.target.value)
                  }
                  placeholder={
                    index === 0
                      ? '주전공 학과명을 입력해주세요. (예시: 컴퓨터공학부)'
                      : '다전공 학과명을 입력해주세요.'
                  }
                />
                {index > 0 && (
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => removeDepartment(index)}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className={styles.addButton}
              onClick={addDepartment}
              disabled={departments.length >= 1 + MAX_SUB_MAJORS}
            >
              추가
            </button>

            {errors.department ? (
              <p className={styles.error}>{errors.department}</p>
            ) : (
              <p className={styles.helper}>
                주전공은 필수 작성이며, 다전공은 총 6개 이하로 중복되지 않게
                입력해주세요.
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              이력서 (CV) <span className={styles.required}>*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {!cvFileName ? (
              <button
                type="button"
                className={styles.cvUpload}
                onClick={handleFileClick}
              >
                PDF 파일만 업로드 가능해요.
              </button>
            ) : (
              <div className={styles.cvInfoRow}>
                <div className={styles.cvFileName}>{cvFileName}</div>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={clearFile}
                >
                  삭제
                </button>
              </div>
            )}

            {errors.cv ? (
              <p className={styles.error}>{errors.cv}</p>
            ) : (
              <p className={styles.helper}>
                5MB 이하의 PDF 파일을 업로드해주세요.
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              className={styles.back}
              onClick={() => navigate(-1)}
            >
              뒤로가기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreate;
