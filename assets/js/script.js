const reader = new FileReader();

const db = 'https://ars-db.onrender.com';

let vezes = 0;

var periodos = []
var materias = []

async function loadData() {
    const response = await axios.get(db);
    const data = await response.data;
    
    data.forEach((row) => {
        if (row[0][0] != 'P') {
            if (periodos.includes(row[0][0]) == false) {
                periodos.push(row[0][0])
            }
            if (materias.includes(row) == false) {
                materias.push([row[0][0], row[1], row[2], row[3]])
            }
        }
    });
}

const periodosFill = (periodoSelect) => {
    if (periodos) {
        periodoSelect.innerHTML = "<option value='' selected disabled></option>"
        periodos.forEach((periodo) => {
            const option = new Option(periodo, periodo)
            periodoSelect.add(option)
        })
}
}

loadData().then(() => {
    var rows = document.getElementById('horarios-table').getElementsByTagName('tbody')[0].rows
    rows = Array.from(rows)
    rows.forEach((row) => {
        const periodoSelect = row.querySelector('.periodoSelect')
        periodosFill(periodoSelect)
    }
    )
})

const materiasFill = (childEl) => {
    const thisParentEl = childEl.parentElement
    const parentEl = thisParentEl.parentElement
    const parentId = parentEl.id
    const parentRow = document.getElementById(parentId)
    var materiaCell = parentRow.querySelector('.materiaCell')
    if (materiaCell !== null) {
        materiaCell.innerHTML = ''
    }
    var materiaSelect = document.createElement('select')
    materiaSelect.innerHTML = "<option value='' selected disabled></option>"
    materias.forEach((materia) => {
        if (materia[0] == childEl.value) {
            const option = new Option(materia[1], materia[1])
            materiaSelect.add(option)
        }
    })
    materiaSelect.onchange = (event) => {
        const selectedOption = event.target.value
        const selectedMateria = materias.find((materia) => materia[1] === selectedOption)
        if (selectedMateria) {
            const professorCell = parentRow.querySelector('.professorCell')
            const professorInput = professorCell.querySelector('input')
            if (professorInput) {
                professorInput.value = selectedMateria[3]
            }
            const situacaoCell = parentRow.querySelector('.situacaoCell')
            const situacaoInput = situacaoCell.querySelector('input')
            if (situacaoInput) {
                situacaoInput.value = selectedMateria[2]
            }
        }
    }
    materiaCell.appendChild(materiaSelect)
}


// Função para adicionar novas linhas à tabela
function addTableRow() {
    const table = document.getElementById('horarios-table').getElementsByTagName('tbody')[0];
    const rowCount = table.rows.length;
    const newRow = table.insertRow(rowCount);
    newRow.setAttribute('id', `row_${rowCount + 1}`);
    
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
    
    // Célula Período
    const periodoSelect = document.createElement('select');
    periodoSelect.innerHTML = "<option value='' selected disabled></option>"
    periodos.forEach((periodo) => {
        const option = new Option(periodo, periodo);
        periodoSelect.add(option);
    });
    periodoSelect.name = `periodo`;
    periodoSelect.classList.add('periodoSelect');
    periodoSelect.setAttribute('onchange', 'materiasFill(this )');
    const cell2 = newRow.insertCell(1);
    
    cell2.appendChild(periodoSelect);
    
    // Célula Disciplina (vazia)
    const cell3 = newRow.insertCell(2);
    cell3.classList.add('materiaCell');
    cell3.attributes['required'] = true;

    // Célula Situação
    const cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<input type="text" name="situacao" maxlength="1" placeholder="Situação">`;
    
    // Célula Professor
    const cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<input type="text" name="professor" placeholder="Professor">`;
}

// Função para formatar a data atual no formato dd/mm/aaaa
function formatarDataAtual() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para preencher as datas automaticamente
function preencherDatas() {
    const dataFormatada = formatarDataAtual();
    document.getElementById('data-coordenador').textContent = dataFormatada;
    document.getElementById('data-aluno').textContent = dataFormatada;
}

// Executa quando a página carregar
window.onload = preencherDatas;
