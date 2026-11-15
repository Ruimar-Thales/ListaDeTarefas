const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const descricao = document.getElementById("desc").value;
    const prioridade = document.querySelector('input[name="prioridade"]:checked');
    const categoria = document.getElementById("categoria").value;

    console.log(descricao, prioridade, categoria);
});