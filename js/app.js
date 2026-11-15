const form = document.querySelector("form");
const tbody = document.getElementById("taskInfo");

const btnSubmit = document.querySelector(".bnt");
let idEmEdicao = null;

let filtroAtual = "todas";

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvar() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function excluirTarefa(id) {
    if (idEmEdicao === id) {
        idEmEdicao = null;
        btnSubmit.textContent = "Adicionar";
        form.reset();
    }

    tarefas = tarefas.filter(function (tarefa) {
        return tarefa.id !== id;
    });

    salvar();
    renderizar();
}

function alternarConclusao(id) {
    tarefas = tarefas.map(function (tarefa) {
        if (tarefa.id === id) {
            tarefa.concluida = !tarefa.concluida;
        }
        return tarefa;
    });

    salvar();
    renderizar();
}

function iniciarEdicao(id) {
    const tarefa = tarefas.find(function (t) {
        return t.id === id;
    });

    document.getElementById("desc").value = tarefa.descricao;
    document.querySelector(
        'input[name="prioridade"][value="' + tarefa.prioridade + '"]'
    ).checked = true;
    document.getElementById("categoria").value = tarefa.categoria;

    idEmEdicao = id;
    btnSubmit.textContent = "Salvar";
    document.getElementById("desc").focus();
}

function renderizar() {
    tbody.innerHTML = "";

    const tarefasFiltradas = tarefas.filter(function (tarefa) {
        if (filtroAtual === "pendentes") return !tarefa.concluida;
        if (filtroAtual === "concluidas") return tarefa.concluida;
        return true;
    }); 

    tarefasFiltradas.forEach(function (tarefa) {
        const tr = document.createElement("tr");
        if (tarefa.concluida) {
            tr.classList.add("concluida");
        }

        const tdDesc = document.createElement("td");
        tdDesc.textContent = tarefa.descricao;

        const tdPrioridade = document.createElement("td");
        tdPrioridade.textContent = tarefa.prioridade;

        const tdCategoria = document.createElement("td");
        tdCategoria.textContent = tarefa.categoria;

        const tdAcoes = document.createElement("td");
        
        const btnExcluir = document.createElement("button");

        btnExcluir.textContent = "Excluir";
        btnExcluir.addEventListener("click", function () {
            excluirTarefa(tarefa.id);
        });

        const btnConcluir = document.createElement("button");

        btnConcluir.textContent = tarefa.concluida ? "Reabrir" : "Concluir";
        btnConcluir.addEventListener("click", function () {
            alternarConclusao(tarefa.id);
        });

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", function () {
            iniciarEdicao(tarefa.id);
        });

        tdAcoes.append(btnEditar, btnConcluir, btnExcluir);

        tr.append(tdDesc, tdPrioridade, tdCategoria, tdAcoes);
        tbody.appendChild(tr);
    });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const descricao = document.getElementById("desc").value;
    const prioridade = document.querySelector('input[name="prioridade"]:checked');
    const categoria = document.getElementById("categoria").value;

    if (descricao === "" || prioridade === null) {
        alert("Preencha a tarefa e escolha a prioridade.");
        return;
    }

    if (idEmEdicao === null) {
    tarefas.push({
        id: Date.now(),
        descricao: descricao,
        prioridade: prioridade.value,
        categoria: categoria,
        concluida: false
    });
    } else {
        tarefas = tarefas.map(function (tarefa) {
            if (tarefa.id === idEmEdicao) {
                tarefa.descricao = descricao;
                tarefa.prioridade = prioridade.value;
                tarefa.categoria = categoria;
            }
            return tarefa;
        });

        idEmEdicao = null;
        btnSubmit.textContent = "Adicionar";
    }

    salvar();
    renderizar();
    form.reset();
    });

const botoesFiltro = document.querySelectorAll(".filtros button");

botoesFiltro.forEach(function (botao) {
    botao.addEventListener("click", function () {
        filtroAtual = botao.dataset.filtro;

        botoesFiltro.forEach(function (b) {
            b.classList.remove("ativo");
        });
        botao.classList.add("ativo");

        renderizar();
    });
});

renderizar();