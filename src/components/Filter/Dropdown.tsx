import { useEffect, useRef } from 'react';
import styles from './Dropdown.module.css';
import useOutside from './useOutside';

type Props = {
  open: boolean;
  anchorId: string;
  onClose: () => void;
  children: React.ReactNode;
  onReset?: () => void;
  onApply?: () => void;
  width?: number | string;
  role?: 'listbox' | 'dialog';
};

export default function Dropdown({
  open,
  anchorId,
  onClose,
  children,
  onReset,
  onApply,
  width = 280,
  role = 'listbox',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useOutside(ref as React.RefObject<HTMLElement>, onClose);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`${styles.panel} ${open ? styles.open : ''}`}
      style={{ width }}
      role={role}
      aria-labelledby={anchorId}
    >
      <div className={styles.body}>{children}</div>

      {(onReset || onApply) && (
        <div className={styles.footer}>
          {onReset && (
            <button type="button" className={styles.ghost} onClick={onReset}>
              초기화
            </button>
          )}
          {onApply && (
            <button type="button" className={styles.primary} onClick={onApply}>
              적용
            </button>
          )}
        </div>
      )}
    </div>
  );
}
