import React from "react";
import styles from "./Loader.module.css";

const Loader: React.FC = () => {
  return (
    <svg
      className={styles.loader}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
    >
      <path
        fill="#3C74FF"
        stroke="#3C74FF"
        strokeWidth="30"
        d="m148 84.7 13.8-8-10-17.3-13.8 8a50 50 0 0 0-27.4-15.9v-16h-20v16A50 50 0 0 0 63 67.4l-13.8-8-10 17.3 13.8 8a50 50 0 0 0 0 31.7l-13.8 8 10 17.3 13.8-8a50 50 0 0 0 27.5 15.9v16h20v-16a50 50 0 0 0 27.4-15.9l13.8 8 10-17.3-13.8-8a50 50 0 0 0 0-31.7Zm-47.5 50.8a35 35 0 1 1 0-70 35 35 0 0 1 0 70Z"
      >
        <animateTransform
          attributeName="transform"
          calcMode="spline"
          dur="0.7"
          values="0;120"
          keyTimes="0;1"
          keySplines="0 0 1 1"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};

export default Loader;
