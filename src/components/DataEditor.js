import React from 'react';

const DataEditor = ({ data, fileInfo }) => {
    const handleSave = async () => {
        if (!fileInfo) {
            alert("No file loaded to save");
            return;
        }

        const filePath = fileInfo.path;
        const fileType = fileInfo.type;

        console.log('Data to save:', data);
        console.log('Saving file:', filePath, fileType);

        const result = await window.electron.saveFile(filePath, fileType, data);

        if (!result.success) {
            alert(`Failed to save file: ${result.error}`);
        } else {
            alert('File saved successfully');
        }
    };

    return (
        <div>
            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
};

export default DataEditor;