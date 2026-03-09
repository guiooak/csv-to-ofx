import { useState, useCallback } from "react";
import FileUploader from "./components/FileUploader/FileUploader";
import Loader from "./components/Loader/Loader";
import DownloadButton from "./components/DownloadButton/DownloadButton";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import GitHubLink from "./components/GitHubLink/GitHubLink";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import styles from "./App.module.css";
import { parseCsvSemiColon } from "./services/csvParser";
import { fixInstallmentDates, getDateInterval } from "./services/dateUtils";
import {
  buildOfxRawData,
  buildFileName,
  buildOfxFileData,
} from "./services/ofxBuilder";

function App() {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileSelect = useCallback(async (file: File) => {
    setError("");
    setDownloadUrl("");
    setLoading(true);

    try {
      const csvContent = await file.text();

      try {
        parseCsvSemiColon(csvContent);
      } catch {
        throw new Error(
          "Ops! You uploaded an invalid CSV file. Try again with a valid one.",
        );
      }

      const parsedCsvContent = parseCsvSemiColon(csvContent);
      fixInstallmentDates(parsedCsvContent);

      const dates = parsedCsvContent.map((t) => t[0]);
      const { startDate, endDate } = getDateInterval(dates);

      const ofxRawData = buildOfxRawData(parsedCsvContent, startDate, endDate);
      const ofxFileData = buildOfxFileData(ofxRawData);
      const ofxFileName = buildFileName(startDate, endDate);

      // Simulate processing delay (2 seconds as in original)
      setTimeout(() => {
        setLoading(false);
        setDownloadUrl(ofxFileData);
        setFileName(ofxFileName);
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  }, []);

  const handleDismissError = useCallback(() => {
    setError("");
  }, []);

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <GitHubLink />
        <h1>Convert CSV to OFX</h1>
        <br />
        <br />
        <FileUploader onFileSelect={handleFileSelect} />
        <br />
        <DownloadButton
          href={downloadUrl}
          fileName={fileName}
          visible={!!downloadUrl}
        />
        {loading && <Loader />}
        {error && (
          <ErrorMessage message={error} onDismiss={handleDismissError} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
