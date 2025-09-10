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
  
  const tableColumn = ["ID", "Name", "Date", "Status", "Attendance", "Violation"];
  const tableRows: (string | undefined)[][] = [];

  data.forEach(record => {
    const recordData = [
      record.userId,
      record.name,
      record.date,
      record.status,
      record.attendance,
      record.violation || "N/A",
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
        Status: d.status,
        Attendance: d.attendance,
        Violation: d.violation || 'N/A'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Function to export data to CSV
export const exportToCSV = (data: AttendanceRecord[], fileName: string) => {
  const headers = ["UserID", "Name", "Date", "Status", "Attendance", "Violation"];
  const csvRows = [
    headers.join(","),
    ...data.map(row => [
      row.userId,
      row.name,
      row.date,
      row.status,
      row.attendance,
      `"${row.violation || 'N/A'}"`
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
