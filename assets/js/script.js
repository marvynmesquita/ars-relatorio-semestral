const reader = new FileReader();

const db = '/assets/db/matrizESW.xlsx';

async function loadData() {
    const response = await fetch(db);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    jsonData.forEach((row) => { console.log(row); });
} // loadData

loadData();