import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { AttendanceRecord } from './types';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Function to export data to PDF
export const exportToPDF = (data: AttendanceRecord[], fileName: string) => {
  const doc = new jsPDF();
  doc.text(fileName, 14, 16);
  
  const tableColumn = ["ID", "Name", "Date", "Period 1", "Period 2", "Period 3", "Period 4"];
  const tableRows: (string | undefined)[][] = [];

  data.forEach(record => {
    const recordData = [
      record.userId,
      record.name,
      record.date,
      record.periods[0]?.status || 'N/A',
      record.periods[1]?.status || 'N/A',
      record.periods[2]?.status || 'N/A',
      record.periods[3]?.status || 'N/A',
    ];
    tableRows.push(recordData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });
  
  doc.save(`${fileName}.pdf`);
};


// Function to export data to Excel
export const exportToExcel = (data: AttendanceRecord[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(d => ({
        UserID: d.userId,
        Name: d.name,
        Date: d.date,
        'Period 1': d.periods[0]?.status || 'N/A',
        'Period 2': d.periods[1]?.status || 'N/A',
        'Period 3': d.periods[2]?.status || 'N/A',
        'Period 4': d.periods[3]?.status || 'N/A',
        'Period 1 Violation': d.periods[0]?.violation || '',
        'Period 2 Violation': d.periods[1]?.violation || '',
        'Period 3 Violation': d.periods[2]?.violation || '',
        'Period 4 Violation': d.periods[3]?.violation || '',
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Function to export data to CSV
export const exportToCSV = (data: AttendanceRecord[], fileName: string) => {
  const headers = ["UserID", "Name", "Date", "Period1_Status", "Period2_Status", "Period3_Status", "Period4_Status"];
  const csvRows = [
    headers.join(","),
    ...data.map(row => [
      row.userId,
      row.name,
      row.date,
      row.periods[0]?.status || 'N/A',
      row.periods[1]?.status || 'N/A',
      row.periods[2]?.status || 'N/A',
      row.periods[3]?.status || 'N/A',
    ].join(","))
  ];

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
