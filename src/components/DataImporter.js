import React from 'react';
import Papa from 'papaparse';

const DataImporter = ({ setData, setFileInfo }) => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setFileInfo(file);
        const reader = new FileReader();

        reader.onload = (e) => {
            const fileContent = e.target.result;

            if (file.type === "application/json") {
                setData(JSON.parse(fileContent));
            } else if (file.type === "text/csv") {
                Papa.parse(fileContent, {
                    complete: (results) => {
                        setData(results.data);
                    },
                    header: true,
                });
            } else {
                alert("Unsupported file format");
            }
        };

        reader.readAsText(file);
    };

    return (
        <div>
            <input type="file" accept=".csv,.json" onChange={handleFileUpload} />
        </div>
    );
};

export default DataImporter;