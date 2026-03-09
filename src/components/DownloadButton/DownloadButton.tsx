import React from "react";
import styles from "./DownloadButton.module.css";

interface DownloadButtonProps {
  href: string;
  fileName: string;
  visible: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  href,
  fileName,
  visible,
}) => {
  return (
    <a
      className={`${styles.downloadButton} ${visible ? styles.visible : ""}`}
      href={href}
      download={fileName}
    >
      Download OFX
    </a>
  );
};

export default DownloadButton;
