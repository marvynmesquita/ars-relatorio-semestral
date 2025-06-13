function exportarParaPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nomeAluno = document.querySelector(".nome").value || "Aluno";
    const matricula = document.querySelector(".matricula").value;
    const curso = document.querySelector(".curso").value || "Curso";
    const matriz = document.querySelector(".matriz").value;
    const semestre = document.querySelector(".semestre").value;
    const periodo = document.querySelector(".periodo").value || "Periodo";
    const proximoSemestre = document.getElementById("proximo_semestre").value;
    const pedirIsencoes = document.getElementById("pedir_isencoes").value;
    const observacoes = document.querySelector(".observacoes-textarea").value;

    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;
    let currentY = margin;

    // Cabeçalho Superior com Logo
    const logoURL = './assets/img/fusve.png';
    try {
        doc.addImage(logoURL, 'PNG', margin, currentY + -6, 50, 15);
    } catch (e) {
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("FUSVE", margin + 5, currentY + 5);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Fundação Educacional Severino Sombra", margin + 5, currentY + 10);
    }

    doc.setFontSize(8);
    doc.text("MANTIDAS", pageWidth - margin, currentY + 2, { align: "right" });
    doc.text("UNIVASSOURAS: CAMPUS VASSOURAS", pageWidth - margin, currentY + 5, { align: "right" });
    doc.text("MARICA - SAQUAREMA: FACMAR - FAMIPE", pageWidth - margin, currentY + 8, { align: "right" });
    currentY += 20;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Plano de Estudo Semestral", margin, currentY + 5);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Secretaria Acadêmica de Graduação", pageWidth - margin, currentY + 5, { align: "right" });

    const borderStartY = currentY;
    currentY += 20;

    // Informações do Aluno
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const col1WidthL1 = usableWidth * 0.55;
    const col2WidthL1 = usableWidth * 0.25;
    const col3WidthL1 = usableWidth * 0.20;
    const col1WidthL2 = usableWidth * 0.55;
    const col2WidthL2 = usableWidth * 0.25;
    const col3WidthL2 = usableWidth * 0.20;
    const col1X = margin;
    const col2X = margin + col1WidthL1 + 5;
    const col3X = margin + col1WidthL1 + col2WidthL1 + 10;
    const valueOffsetY = 5;

    doc.setFont("helvetica", "bold");
    doc.text("Aluno(a):", col1X, currentY);
    doc.text("Matrícula nº:", col2X, currentY);
    doc.text("Período:", col3X, currentY);
    doc.setFont("helvetica", "normal");
    const nomeLines = doc.splitTextToSize(nomeAluno, col1WidthL1 - 5);
    doc.text(nomeLines, col1X + 17, currentY);
    doc.text(matricula, col2X + 22, currentY);
    doc.text(periodo, col3X + 15, currentY);
    let heightL1 = nomeLines.length * 4;
    currentY += Math.max(heightL1, 4) + valueOffsetY + 2;

    doc.setFont("helvetica", "bold");
    doc.text("Curso:", col1X, currentY);
    doc.text("Matriz:", col2X, currentY);
    doc.text("Semestre:", col3X, currentY);
    doc.setFont("helvetica", "normal");
    const cursoLines = doc.splitTextToSize(curso, col1WidthL2 - 5);
    doc.text(cursoLines, col1X + 13, currentY);
    doc.text(matriz, col2X + 13, currentY);
    doc.text(semestre, col3X + 18, currentY);
    let heightL2 = cursoLines.length * 4;
    currentY += Math.max(heightL2, 4) + valueOffsetY + 8;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Horários de Aula", pageWidth / 2, currentY, { align: "center" });
    currentY += 8;

    // Tabela de Horários de Aula
    const tableHeaders = [["Dias de Aula", "Período", "Disciplina", "Sit.", "Professor"]];
    const tableBody = [];

    const tableRows = document.querySelectorAll("#horarios-table tbody tr");
    tableRows.forEach(row => {
        const rowData = [];
        const diaSelect = row.querySelector("select[name^=\"dia_semana\"]");
        let diaSelecionado = diaSelect ? diaSelect.options[diaSelect.selectedIndex].text : "";

        if (diaSelecionado === "Segunda-feira") diaSelecionado = "Seg";
        else if (diaSelecionado === "Terça-feira") diaSelecionado = "Ter";
        else if (diaSelecionado === "Quarta-feira") diaSelecionado = "Qua";
        else if (diaSelecionado === "Quinta-feira") diaSelecionado = "Qui";
        else if (diaSelecionado === "Sexta-feira") diaSelecionado = "Sex";
        else if (diaSelecionado === "Sábado") diaSelecionado = "Sáb";
        else if (diaSelecionado === "Domingo") diaSelecionado = "Dom";
        rowData.push(diaSelecionado);

        const periodoSelect = row.querySelector("select.periodoSelect");
        rowData.push(periodoSelect ? periodoSelect.options[periodoSelect.selectedIndex].text : "");

        const materiaCell = row.querySelector(".materiaCell");
        const materiaSelect = materiaCell.querySelector("select");
        if (materiaSelect) {
            rowData.push(materiaSelect.options[materiaSelect.selectedIndex].text);
        } else {
            const materiaInput = materiaCell.querySelector("input");
            rowData.push(materiaInput ? materiaInput.value : materiaCell.textContent.trim());
        }

        const situacaoInput = row.querySelector("select[name^=\"situacao\"]");
        rowData.push(situacaoInput ? situacaoInput.value : "");

        const professorInput = row.querySelector("select[name^=\"professor\"]");
        rowData.push(professorInput ? professorInput.value : "");

        if (rowData[2] || rowData[3] || rowData[4]) {
            tableBody.push(rowData);
        }
    });

    const minRows = 6;
    while (tableBody.length < minRows) {
        tableBody.push(["", "", "", "", ""]);
    }

    doc.autoTable({
        head: tableHeaders,
        body: tableBody,
        startY: currentY,
        theme: "grid",
        margin: { left: margin - 5, right: margin - 5 },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            halign: "center",
            fontSize: 9,
            lineWidth: 0.1
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            textColor: [0, 0, 0]
        },
        columnStyles: {
            0: { cellWidth: "auto", halign: "center" },
            1: { cellWidth: "auto", halign: "center" },
            2: { cellWidth: "auto", halign: "left" },
            3: { cellWidth: "auto", halign: "center" },
            4: { cellWidth: "auto", halign: "left" }
        },
        didDrawPage: function (data) {
            currentY = data.cursor.y;
        }
    });

    currentY += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.setFont("helvetica", "bold");
    doc.text("Situação:", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.text("Presencial - P   Digital - D   Remota - R", margin + 20, currentY);
    currentY += 5;

    doc.setFont("helvetica", "bold");
    doc.text("Próximo Semestre:", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(proximoSemestre, margin + 35, currentY);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.1);
    doc.line(margin + 35, currentY + 1, margin + 120, currentY + 1);
    currentY += 5;

    doc.setFont("helvetica", "bold");
    doc.text("Pedir isenções das disciplinas:", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(pedirIsencoes, margin + 55, currentY);
    doc.line(margin + 55, currentY + 1, margin + 120, currentY + 1);
    currentY += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Observações:", margin, currentY);
    currentY += 5;
    doc.setFont("helvetica", "normal");
    const obsLines = doc.splitTextToSize(observacoes, usableWidth);
    doc.text(obsLines, margin, currentY);
    currentY += obsLines.length * 4 + 10;

    // Assinaturas
    let signatureY = Math.max(currentY, doc.internal.pageSize.getHeight() - 50);
    const signatureColWidth = (pageWidth - 2 * (margin - 5)) / 2;
    const sigCol1X = margin - 5;
    const sigCol2X = margin - 5 + signatureColWidth;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    doc.setFillColor(255, 255, 255);
    doc.rect(sigCol1X, signatureY, signatureColWidth, 8, 'FD');
    doc.rect(sigCol2X, signatureY, signatureColWidth, 8, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Coordenador do Curso", sigCol1X + signatureColWidth / 2, signatureY + 5, { align: "center" });
    doc.text("Ciente do Aluno(a)", sigCol2X + signatureColWidth / 2, signatureY + 5, { align: "center" });

    doc.rect(sigCol1X, signatureY + 8, signatureColWidth, 30, 'S');
    doc.rect(sigCol2X, signatureY + 8, signatureColWidth, 30, 'S');

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const dateWidth = 40;

    const dataCoordenador = document.getElementById('data-coordenador').textContent;
    const dataAluno = document.getElementById('data-aluno').textContent;

    // Primeira célula de assinatura (Coordenador)
    const dateStartX1 = sigCol1X + 10;

    const dataCoordParts = dataCoordenador.split('/');
    if (dataCoordParts.length === 3) {
        doc.text(dataCoordParts[0], dateStartX1 + 4, signatureY + 19);
        doc.text(dataCoordParts[1], dateStartX1 + 14, signatureY + 19);
        doc.text(dataCoordParts[2], dateStartX1 + 22, signatureY + 19);
    }

    doc.text("/", dateStartX1 + 10, signatureY + 19);
    doc.text("/", dateStartX1 + 20, signatureY + 19);

    doc.line(dateStartX1, signatureY + 20, dateStartX1 + 30, signatureY + 20);
    doc.text("Data", dateStartX1 + 15, signatureY + 25, { align: "center" });

    const signStartX1 = dateStartX1 + dateWidth;
    doc.line(signStartX1, signatureY + 20, sigCol1X + signatureColWidth - 10, signatureY + 20);
    doc.text("Carimbo/Assinatura", (signStartX1 + (sigCol1X + signatureColWidth - 10)) / 2, signatureY + 25, { align: "center" });

    // Segunda célula de assinatura (Aluno)
    const dateStartX2 = sigCol2X + 10;

    const dataAlunoParts = dataAluno.split('/');
    if (dataAlunoParts.length === 3) {
        doc.text(dataAlunoParts[0], dateStartX2 + 4, signatureY + 19);
        doc.text(dataAlunoParts[1], dateStartX2 + 14, signatureY + 19);
        doc.text(dataAlunoParts[2], dateStartX2 + 22, signatureY + 19);
    }

    doc.text("/", dateStartX2 + 10, signatureY + 19);
    doc.text("/", dateStartX2 + 20, signatureY + 19);

    doc.line(dateStartX2, signatureY + 20, dateStartX2 + 30, signatureY + 20);
    doc.text("Data", dateStartX2 + 15, signatureY + 25, { align: "center" });

    const signStartX2 = dateStartX2 + dateWidth;
    doc.line(signStartX2, signatureY + 20, sigCol2X + signatureColWidth - 10, signatureY + 20);
    doc.text("Assinatura", (signStartX2 + (sigCol2X + signatureColWidth - 10)) / 2, signatureY + 25, { align: "center" });

    // borda ao redor do conteúdo
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin - 5, borderStartY - 5, usableWidth + 10,
        doc.internal.pageSize.getHeight() - (borderStartY - 5) - (margin - 5), 3, 3);

    const sanitizeFilename = (name) => name.replace(/[^a-z0-9\.\-\_]/gi, "_").replace(/\s+/g, "_");
    const filename = `${sanitizeFilename(nomeAluno)}-${sanitizeFilename(curso)}-${sanitizeFilename(periodo)}_plano_estudo.pdf`;

    doc.save(filename);
}