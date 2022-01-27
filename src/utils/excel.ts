import * as XLSX from 'xlsx';

export function ReadExcelFile(filename: string, options?, lineHeader = 0) {
  const workbook = XLSX.readFile(filename, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils
    .sheet_to_json(sheet, options)
    .map(
      (row, index) =>
        index > lineHeader &&
        Object.keys(row).reduce((obj, key) => {
          obj[key.trim()] =
            typeof row[key] === 'string' ? row[key].trim() : row[key];
          return obj;
        }, {}),
    )
    .filter((x) => x);
}
