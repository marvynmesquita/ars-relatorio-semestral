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
            if (materias.includes(row) == false) {
                materias.push([row[0][0], row[1]])
            }
        }
    });

    if (periodos) {
        periodoSelect.innerHTML = "<option value='' selected disabled></option>"
        periodos.forEach((periodo) => {
            const option = new Option(periodo, periodo)
            periodoSelect.add(option)
        })
}
} // loadData

loadData();

const materiasFill = () => {
    var materiaCell = document.querySelector('.materiaCell')
    materiaCell.innerHTML = ''
    var materiaSelect = document.createElement('select')
    materiaSelect.innerHTML = "<option value='' selected disabled></option>"
    const periodoEscolhido = periodoSelect.value
    console.log(materias)
    materias.forEach((materia) => {
        if (materia[0] === periodoEscolhido) {
            const matopt = new Option(materia[1],materia[1])
            materiaSelect.add(matopt)
            console.log(materia)
        }
    })
    materiaCell.appendChild(materiaSelect)
}