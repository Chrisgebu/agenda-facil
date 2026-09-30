let clientes = carregarDados("agendaFacilClientes");
const formularioCliente = document.querySelector("#form-cliente");
const buscaCliente = document.querySelector("#busca-cliente");

// Reconstrói a lista e aplica a pesquisa sem recarregar a página.
function exibirClientes() {
  const busca = buscaCliente.value.trim().toLowerCase();
  const resultado = clientes.filter(cliente => cliente.nome.toLowerCase().includes(busca));
  const lista = document.querySelector("#lista-clientes");
  lista.replaceChildren();
  document.querySelector("#resumo-clientes").textContent =
    `${resultado.length} cliente(s) exibido(s) de ${clientes.length} cadastrado(s).`;

  if (resultado.length === 0) {
    lista.appendChild(criarElemento("p", "Nenhum cliente encontrado."));
  }

  resultado.forEach(cliente => {
    const item = document.createElement("article");
    item.appendChild(criarElemento("h3", cliente.nome));
    item.appendChild(criarElemento("p", `Telefone: ${cliente.telefone}`));
    if (cliente.email) {
      item.appendChild(criarElemento("p", `E-mail: ${cliente.email}`));
    }
    lista.appendChild(item);
  });
}

// Valida os campos antes de inserir um novo cliente no array.
function cadastrarCliente(evento) {
  evento.preventDefault();
  const nome = document.querySelector("#nome").value.trim();
  const telefone = document.querySelector("#telefone").value.trim();
  const campoEmail = document.querySelector("#email");
  const email = campoEmail.value.trim().toLowerCase();
  campoEmail.value = email;
  // Compara telefones pelos dígitos, mesmo quando a formatação é diferente.
  const digitos = telefone.replace(/\D/g, "");

  if (nome.length < 2 || nome.length > 80) {
    mostrarMensagem("Informe um nome com 2 a 80 caracteres.", true);
    return;
  }
  if (!/^[\d\s()+-]+$/.test(telefone) || digitos.length < 10 || digitos.length > 11) {
    mostrarMensagem("Informe um telefone com DDD e 10 ou 11 dígitos, sem letras.", true);
    return;
  }
  if (!campoEmail.validity.valid) {
    mostrarMensagem("Informe um e-mail válido ou deixe esse campo vazio.", true);
    return;
  }
  if (clientes.some(cliente => cliente.telefone.replace(/\D/g, "") === digitos)) {
    mostrarMensagem("Já existe um cliente com esse telefone.", true);
    return;
  }

  const novoCliente = { id: Date.now(), nome, telefone, email };
  const novosClientes = [...clientes, novoCliente];
  if (!salvarDados("agendaFacilClientes", novosClientes)) {
    return;
  }
  clientes = novosClientes;
  formularioCliente.reset();
  buscaCliente.value = "";
  exibirClientes();
  mostrarMensagem(`Cliente ${nome} cadastrado com sucesso.`);
}

if (clientes !== null) {
  formularioCliente.addEventListener("submit", cadastrarCliente);
  formularioCliente.addEventListener("reset", limparMensagem);
  buscaCliente.addEventListener("input", () => {
    limparMensagem();
    exibirClientes();
  });
  exibirClientes();
} else {
  formularioCliente.querySelector('button[type="submit"]').disabled = true;
}
