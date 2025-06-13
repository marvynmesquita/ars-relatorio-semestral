const reader = new FileReader();

const db = 'https://ars-db.onrender.com';

var periodos = []
var materias = []
let matriz;

const matrizInput = document.getElementsByClassName('matriz')[0];
matrizInput.addEventListener('change', (event) => {
    periodos, materias = [];
    const matriz = event.target.value;
    if (matriz) {
        loadData(`${db}/${matriz}`).then(() => {
            var rows = document.getElementById('horarios-table').getElementsByTagName('tbody')[0].rows
            rows = Array.from(rows)
            rows.forEach((row) => {
                const periodoSelect = row.querySelector('.periodoSelect')
                periodosFill(periodoSelect)
            }
            )
        })
    }
});

async function loadData(matriz) {
    const response = await axios.get(matriz);
    const data = await response.data;
    data.forEach((row) => {
        if (row[0][0] != 'P') {
            if (periodos.includes(row[0]) == false) {
                periodos.push(row[0])
            }
            console.log('Periodos adicionados:', periodos);
            if (materias.includes(row) == false) {
                materias.push([row[0], row[1], row[2], row[3]])
            }
            console.log('Materias adicionadas:', materias);
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
    cell4.innerHTML = `
        <select name="situacao_${rowCount + 1}">
            <option value="">Selecione</option>
            <option value="Remoto">Remoto</option>
            <option value="Presencial">Presencial</option>
        </select>
    `;
    
    // Célula Professor
    const cell5 = newRow.insertCell(4);
    cell5.innerHTML = `
        <select name="professor_${rowCount + 1}">
            <option value="">Selecione</option>
            <option value="André Ricardo Saraiva">André Ricardo Saraiva</option>
            <option value="Altemar Sales de Oliveira">Altemar Sales de Oliveira</option>
            <option value="Diego Ramos Inácio">Diego Ramos Inácio</option>
            <option value="Gioliano Barbosa Bertoni">Gioliano Barbosa Bertoni</option>
            <option value="João Batista Lopes Coelho Júnior">João Batista Lopes Coelho Júnior</option>
            <option value="Luciano Barbosa da Silva">Luciano Barbosa da Silva</option>
            <option value="Mukenge Shay">Mukenge Shay</option>
            <option value="Rodrigo Galdino Ximenes">Rodrigo Galdino Ximenes</option>
            <option value="Sergio Santos Filho">Sergio Santos Filho</option>
            <option value="Sergio de Oliveira Santos">Sergio de Oliveira Santos</option>
        </select>
    `;
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

// Autocomplete para o campo de curso
document.addEventListener('DOMContentLoaded', function() {
    const cursoInput = document.querySelector('.curso');
    const cursos = ['Engenharia de Software', 'Engenharia Civil'];
    
    cursoInput.addEventListener('input', function(e) {
        const input = e.target.value.toLowerCase();
        
        // Limpa sugestões anteriores
        const datalist = document.getElementById('curso-suggestions');
        if (datalist) {
            datalist.remove();
        }
        
        if (input.length < 3) return; // Mostra sugestões após 3 caracteres
        
        const matches = cursos.filter(curso => 
            curso.toLowerCase().includes(input)
        );
        
        if (matches.length > 0) {
            const newDatalist = document.createElement('datalist');
            newDatalist.id = 'curso-suggestions';
            
            matches.forEach(match => {
                const option = document.createElement('option');
                option.value = match;
                newDatalist.appendChild(option);
            });
            
            document.body.appendChild(newDatalist);
            cursoInput.setAttribute('list', 'curso-suggestions');
        }
    });
    
    // Fechar sugestões quando clicar fora
    document.addEventListener('click', function(e) {
        if (e.target !== cursoInput) {
            const datalist = document.getElementById('curso-suggestions');
            if (datalist) {
                datalist.remove();
            }
        }
    });
});
