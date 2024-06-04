import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DataTable = ({ data, setData }) => {
    const columns = data.length > 0 ? Object.keys(data[0]).map((key) => ({
        field: key,
        headerName: key,
        width: 150,
        editable: key !== 'id'
    })) : [];

    const rows = data.map((row, index) => ({
        id: index,
        ...row,
    }));

    const processRowUpdate = (newRow) => {
        const updatedData = data.map((row) => (row.id === newRow.id ? newRow : row));
        console.log('Updated data:', updatedData);
        setData(updatedData);
        return newRow;
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                processRowUpdate={processRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
            />
        </div>
    );
};

export default DataTable;