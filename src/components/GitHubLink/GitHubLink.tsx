import React from "react";
import styles from "./GitHubLink.module.css";

const GitHubLink: React.FC = () => {
  return (
    <div className={styles.gitHubLink}>
      <a
        target="_blank"
        href="https://github.com/guibrancopc/csv-to-ofx?tab=readme-ov-file"
        className={styles.link}
      >
        GitHub
      </a>
    </div>
  );
};

export default GitHubLink;
