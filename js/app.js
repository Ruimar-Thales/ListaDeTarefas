const form = document.querySelector("form");
const tbody = document.getElementById("taskInfo");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const descricao = document.getElementById("desc").value;
    const prioridade = document.querySelector('input[name="prioridade"]:checked');
    const categoria = document.getElementById("categoria").value;

    if (descricao === "" || prioridade === null) {
        alert("Preencha a tarefa e escolha a prioridade.");
        return;
    }

    const tr = document.createElement("tr");

    const tdDesc = document.createElement("td");
    tdDesc.textContent = descricao;

    const tdPrioridade = document.createElement("td");
    tdPrioridade.textContent = prioridade.value;

    const tdCategoria = document.createElement("td");
    tdCategoria.textContent = categoria;

    const tdAcoes = document.createElement("td");
    tdAcoes.textContent = "-";

    tr.append(tdDesc, tdPrioridade, tdCategoria, tdAcoes);
    tbody.appendChild(tr);

    form.reset();
});