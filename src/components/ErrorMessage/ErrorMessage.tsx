import React from "react";
import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <div className={styles.errorMessage} role="alert">
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 7.5v5.5m0 3v.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <p className={styles.text}>{message}</p>
      {onDismiss && (
        <button
          className={styles.closeButton}
          onClick={onDismiss}
          aria-label="Fechar mensagem de erro"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
