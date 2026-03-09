import React, { useState } from "react";
import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className={styles.errorMessage}>
      <button
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label="Dismiss error"
      >
        &times;
      </button>
      {message}
    </div>
  );
};

export default ErrorMessage;
