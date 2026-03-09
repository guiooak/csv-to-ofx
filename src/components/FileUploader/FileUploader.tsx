import {
  useRef,
  useState,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import styles from "./FileUploader.module.css";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFileName(file.name);
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);

      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFileName(file.name);
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  return (
    <div
      className={`${styles.container} ${isDragOver ? styles.dragOver : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <form>
        <label htmlFor="input-file" className={styles.inputFileLabel}>
          Upload your CSV file
        </label>
        <input
          type="file"
          name="input-file"
          id="input-file"
          ref={fileInputRef}
          className={styles.displayNone}
          accept=".csv"
          onChange={handleFileChange}
        />
        {fileName && (
          <div className={styles.fileName}>Selected CSV File: {fileName}</div>
        )}
      </form>
    </div>
  );
};

export default FileUploader;
