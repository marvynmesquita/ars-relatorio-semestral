const reader = new FileReader();

const db = '/assets/db/matrizESW.xlsx';

var periodos = []
var materias = []

var periodoSelect = document.querySelector('.periodoSelect')

async function loadData() {
    const response = await fetch(db);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    jsonData.forEach((row) => {
        if (row[0][0] != 'P') {
            if (periodos.includes(row[0][0]) == false) {
                periodos.push(row[0][0])
            }
            if (materias.includes(row[1]) == false) {
                materias.push(row[1])
            }
        }

    });

    if (periodos) {
        periodos.forEach((periodo) => {
            const option = new Option(periodo, periodo)
            periodoSelect.add(option)
        })
    console.log(periodoSelect)
}
} // loadData

loadData();