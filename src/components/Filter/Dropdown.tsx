import { useEffect, useRef } from "react";
import styles from "./Dropdown.module.css";
import useOutside from "./useOutside";

type Props = {
  open: boolean;
  anchorId: string;            // 버튼 id (aria-labelledby 연동)
  onClose: () => void;
  children: React.ReactNode;
  onReset?: () => void;        // 하단 "초기화"
  onApply?: () => void;        // 하단 "적용"
  width?: number | string;
  role?: "listbox" | "dialog";
};

export default function Dropdown({
  open,
  anchorId,
  onClose,
  children,
  onReset,
  onApply,
  width = 280,
  role = "listbox",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useOutside(ref, onClose);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      className={`${styles.panel} ${open ? styles.open : ""}`}
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
