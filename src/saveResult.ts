import fs from "fs";

export interface CSVRow {
    url: string;
    summary: string;
    title: string;
    tt: string;
}

export function insertRow(data: CSVRow[], url: string, summary: string, title: string, tt:string): void {
    const newRow: CSVRow = { url, summary,title, tt};
    data.push(newRow);
}

export function convertToCSV(data: CSVRow[]): string {
    const header = Object.keys(data[0]).join('^') + '\n';

    const rows = data
        .map((row) => Object.values(row).join('^'))
        .join('\n');

    return header + rows;
}

export function saveCSVToFile(csvData: string, filePath: string): void {
    fs.writeFile(filePath, csvData, (err) => {
        if (err) {
            console.error('Error saving CSV file:', err);
        } else {
            console.log('CSV file saved successfully!');
        }
    });
}