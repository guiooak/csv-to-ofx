import React from "react";
import styles from "./Logo.module.css";

const Logo: React.FC = () => {
  return (
    <span className={styles.logo}>
      <svg
        className={styles.mark}
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="32" height="32" rx="8" fill="var(--accent)" />
        <g
          fill="none"
          stroke="var(--accent-ink)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8.5 11h8M8.5 16h5M8.5 21h8" />
          <path d="M19.5 12.5 23.5 16l-4 3.5" />
        </g>
      </svg>
      <span className={styles.wordmark}>
        <span className={styles.from}>csv</span>
        <span className={styles.arrow}>→</span>
        <span className={styles.to}>ofx</span>
      </span>
    </span>
  );
};

export default Logo;
