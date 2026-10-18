import React from "react";
import styles from "./ConversionResult.module.css";

export interface ConversionData {
  href: string;
  fileName: string;
  sourceName: string;
  startDate: string;
  endDate: string;
  transactionCount: number;
}

interface ConversionResultProps {
  data: ConversionData;
  onReset: () => void;
}

const ConversionResult: React.FC<ConversionResultProps> = ({
  data,
  onReset,
}) => {
  return (
    <div className={styles.result}>
      <span className={styles.check} aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="m5 12.5 4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <h2 className={styles.title}>Pronto! Seu OFX está gerado.</h2>
      <p className={styles.source}>{data.sourceName}</p>

      <dl className={styles.stats}>
        <div>
          <dt>Período</dt>
          <dd>
            {data.startDate} – {data.endDate}
          </dd>
        </div>
        <div>
          <dt>Lançamentos</dt>
          <dd>{data.transactionCount}</dd>
        </div>
      </dl>

      <a className={styles.download} href={data.href} download={data.fileName}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Baixar OFX
      </a>
      <p className={styles.fileName}>{data.fileName}</p>

      <button type="button" className={styles.reset} onClick={onReset}>
        Converter outro arquivo
      </button>
    </div>
  );
};

export default ConversionResult;
