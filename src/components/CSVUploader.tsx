import Papa from "papaparse";
import type { ParseResult } from "papaparse"

interface CSVUploaderProps {
  onDataParsed: (data: string[][]) => void;
}

export default function CSVUploader({ onDataParsed }: CSVUploaderProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<string[]>(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: ParseResult<string[]>) => {
        onDataParsed(results.data);
      }
    });
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="border p-2 pr-0 max-w-4/5 rounded font-montserrat"
      />
    </div>
  );
}
