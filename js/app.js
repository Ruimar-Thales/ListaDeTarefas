const form = document.querySelector("form");
const tbody = document.getElementById("taskInfo");

const btnSubmit = document.querySelector(".bnt");
let idEmEdicao = null;

let filtroAtual = "todas";

const mensagem = document.getElementById("mensagem");
let timerMensagem;

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo;

    clearTimeout(timerMensagem);
    timerMensagem = setTimeout(function () {
        mensagem.textContent = "";
        mensagem.className = "mensagem";
    }, 3000);
}

function salvar() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function excluirTarefa(id) {
    if (!confirm("Deseja realmente excluir esta tarefa?")) {
        return;
    }

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
    mostrarMensagem("Tarefa excluída.", "sucesso");
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
    mostrarMensagem("Status da tarefa atualizado.", "sucesso");
}

function iniciarEdicao(id) {
    const tarefa = tarefas.find(function (t) {
        return t.id === id;
    });

    document.getElementById("desc").value.trim() = tarefa.descricao;
    document.querySelector(
        'input[name="prioridade"][value="' + tarefa.prioridade + '"]'
    ).checked = true;
    document.getElementById("categoria").value = tarefa.categoria;

    idEmEdicao = id;
    btnSubmit.textContent = "Salvar";
    document.getElementById("desc").focus();
}

function atualizarContadores() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(function (tarefa) {
        return tarefa.concluida;
    }).length;
    const pendentes = total - concluidas;

    document.getElementById("countTotal").textContent = total;
    document.getElementById("countPending").textContent = pendentes;
    document.getElementById("countDone").textContent = concluidas;
}

function renderizar() {
    tbody.innerHTML = "";

    atualizarContadores();

    const tarefasFiltradas = tarefas.filter(function (tarefa) {
        if (filtroAtual === "pendentes") return !tarefa.concluida;
        if (filtroAtual === "concluidas") return tarefa.concluida;
        return true;
    }); 

    if (tarefasFiltradas.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 4;
        td.textContent = "Nenhuma tarefa encontrada.";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

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
        btnExcluir.className = "btn-excluir";
        btnExcluir.addEventListener("click", function () {
            excluirTarefa(tarefa.id);
        });

        const btnConcluir = document.createElement("button");

        btnConcluir.textContent = tarefa.concluida ? "Reabrir" : "Concluir";
        btnConcluir.className = tarefa.concluida ? "btn-reabrir" : "btn-concluir";
        btnConcluir.addEventListener("click", function () {
            alternarConclusao(tarefa.id);
        });

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "btn-editar";
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

    const descricao = document.getElementById("desc").value.trim();
    const prioridade = document.querySelector('input[name="prioridade"]:checked');
    const categoria = document.getElementById("categoria").value;

    if (descricao === "" || prioridade === null) {
        mostrarMensagem("Preencha a tarefa e escolha a prioridade.", "erro");
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
        mostrarMensagem("Tarefa adicionada!", "sucesso");

    } else {
        tarefas = tarefas.map(function (tarefa) {
            if (tarefa.id === idEmEdicao) {
                tarefa.descricao = descricao;
                tarefa.prioridade = prioridade.value;
                tarefa.categoria = categoria;
            }
            return tarefa;
        });
        mostrarMensagem("Tarefa atualizada!", "sucesso");

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