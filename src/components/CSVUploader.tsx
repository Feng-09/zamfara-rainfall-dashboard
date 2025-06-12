import React from 'react';
import Papa from 'papaparse';

export default function CSVUploader({ onDataParsed }: {
    onDataParsed: (data: any[][]) => void;
}) {
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                onDataParsed(results.data)
            }
        })
    };

    return (
        <div>
            <input
               type="file"
               accept=".csv"
               onChange={handleFileUpload}
               className="border p-2 rounded"
            />
        </div>
    )
}