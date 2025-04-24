const reader = new FileReader();

const db = '/assets/db/matrizESW.xlsx';

var periodos = []
var materias = []

var periodoSelect = document.querySelector('.periodoSelect')

async function loadData() {
    const response = await axios.get(db, { responseType: 'arraybuffer', headers: { 'Access-Control-Allow-Origin' : '*' } });
    const data = await new Uint8Array(response.data);
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
    materias.forEach((materia) => {
        if (materia[0] === periodoEscolhido) {
            const matopt = new Option(materia[1],materia[1])
            materiaSelect.add(matopt)
        }
    })
    materiaCell.appendChild(materiaSelect)
}

// Função para adicionar novas linhas à tabela
function addTableRow() {
    const table = document.getElementById('horarios-table').getElementsByTagName('tbody')[0];
    const rowCount = table.rows.length;
    const newRow = table.insertRow(rowCount);
    
    // Célula Dias de Aula
    const cell1 = newRow.insertCell(0);
    cell1.innerHTML = `
        <select name="dia_semana_${rowCount + 1}">
            <option value="">Selecione</option>
            <option value="segunda">Segunda-feira</option>
            <option value="terca">Terça-feira</option>
            <option value="quarta">Quarta-feira</option>
            <option value="quinta">Quinta-feira</option>
            <option value="sexta">Sexta-feira</option>
            <option value="sabado">Sábado</option>
        </select>
    `;
    
    // Célula Período (vazia)
    newRow.insertCell(1);
    
    // Célula Disciplina (vazia)
    newRow.insertCell(2);
    
    // Célula Situação
    const cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<input type="text" name="situacao_${rowCount + 1}" maxlength="1" placeholder="Situação">`;
    
    // Célula Professor
    const cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<input type="text" name="professor_${rowCount + 1}" placeholder="Professor">`;
}
