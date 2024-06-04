import React, { useState } from 'react';
import DataImporter from './components/DataImporter';
import DataTable from './components/DataTable';
import Visualization3D from './components/Visualization3D';
import DataEditor from './components/DataEditor';

function App() {
    const [data, setData] = useState([]);
    const [fileInfo, setFileInfo] = useState(null);

    return (
        <div className="App">
            <h1>3D Data Visualization App</h1>
            <DataImporter setData={setData} setFileInfo={setFileInfo} />
            <DataTable data={data} setData={setData} />
            <Visualization3D data={data} />
            <DataEditor data={data} fileInfo={fileInfo} />
        </div>
    );
}

export default App;