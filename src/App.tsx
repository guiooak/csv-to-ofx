import { useState, useCallback } from "react";
import Header from "./components/Header/Header";
import FileUploader from "./components/FileUploader/FileUploader";
import Loader from "./components/Loader/Loader";
import ConversionResult, {
  type ConversionData,
} from "./components/ConversionResult/ConversionResult";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import styles from "./App.module.css";
import { parseCsvSemiColon } from "./services/csvParser";
import { fixInstallmentDates, getDateInterval } from "./services/dateUtils";
import {
  buildOfxRawData,
  buildFileName,
  buildOfxFileData,
} from "./services/ofxBuilder";

const INVALID_FILE_MESSAGE =
  "Não foi possível ler este arquivo. Envie o CSV exportado da fatura do cartão Sicredi.";

const STEPS = [
  {
    title: "Exporte a fatura",
    text: "No app ou internet banking Sicredi, baixe a fatura do cartão em CSV.",
  },
  {
    title: "Envie o arquivo",
    text: "Arraste o CSV para a área acima ou escolha no computador.",
  },
  {
    title: "Importe o OFX",
    text: "Baixe o OFX e importe no seu app de gestão financeira.",
  },
];

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConversionData | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileSelect = useCallback(async (file: File) => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const csvContent = await file.text();

      let parsedCsvContent: string[][];
      try {
        parsedCsvContent = parseCsvSemiColon(csvContent);
      } catch {
        throw new Error(INVALID_FILE_MESSAGE);
      }

      if (parsedCsvContent.length === 0) {
        throw new Error(INVALID_FILE_MESSAGE);
      }

      fixInstallmentDates(parsedCsvContent);

      const dates = parsedCsvContent.map((t) => t[0]);
      const { startDate, endDate } = getDateInterval(dates);

      const ofxRawData = buildOfxRawData(parsedCsvContent, startDate, endDate);
      const ofxFileData = buildOfxFileData(ofxRawData);
      const ofxFileName = buildFileName(startDate, endDate);
      const transactionCount = parsedCsvContent.filter(
        ([date, description, , value]) => date && description && value,
      ).length;

      // Short delay so the loading state is perceptible
      setTimeout(() => {
        setLoading(false);
        setResult({
          href: ofxFileData,
          fileName: ofxFileName,
          sourceName: file.name,
          startDate,
          endDate,
          transactionCount,
        });
      }, 600);
    } catch {
      setLoading(false);
      setError(INVALID_FILE_MESSAGE);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setError("");
  }, []);

  const handleDismissError = useCallback(() => {
    setError("");
  }, []);

  return (
    <ErrorBoundary>
      <div className={styles.page}>
        <Header />

        <main className={styles.main}>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>Cartão de crédito Sicredi</p>
            <h1 className={styles.title}>
              Converta a fatura em CSV para OFX
            </h1>
            <p className={styles.subtitle}>
              Gere um arquivo OFX pronto para importar no seu app de finanças,
              com parcelas já lançadas no mês certo.
            </p>
          </section>

          <section className={styles.card} aria-live="polite">
            {loading ? (
              <Loader />
            ) : result ? (
              <ConversionResult data={result} onReset={handleReset} />
            ) : (
              <FileUploader onFileSelect={handleFileSelect} />
            )}
            {error && (
              <ErrorMessage message={error} onDismiss={handleDismissError} />
            )}
          </section>

          <p className={styles.privacy}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect
                x="5"
                y="10.5"
                width="14"
                height="9.5"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
            Tudo acontece no seu navegador. Nenhum dado é enviado.
          </p>

          <ol className={styles.steps}>
            {STEPS.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <div>
                  <h2 className={styles.stepTitle}>{step.title}</h2>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </main>

        <footer className={styles.footer}>
          Projeto pessoal e open source, sem vínculo com o Sicredi.
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
