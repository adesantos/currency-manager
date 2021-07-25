import React from 'react'
import Button from '@material-ui/core/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const ExportFile = ({data}) => {

    const fileName = 'countries';
    const fileExtension = '.xlsx';
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const exportToCSV = (list, fileName) => {
        const ws = XLSX.utils.json_to_sheet(list);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button 
            style={{padding: '5px 8px', color: '#3f51b5', border: '1px solid rgba(63, 81, 181, 0.5)'}}
            onClick={(e) => exportToCSV(data, fileName)}
        >
            Export
        </Button>
    )
}