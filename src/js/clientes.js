// Controlador da página Clientes: conecta a interface ao serviço assíncrono.
import { criarElemento, limparMensagem, mostrarCarregamento, mostrarMensagem } from "./modulos/interface.js";
import { atualizarCliente, consultarClientes, criarCliente, excluirCliente } from "./servicos/cliente-service.js";

const formularioCliente = document.querySelector("#form-cliente");
const buscaCliente = document.querySelector("#busca-cliente");
const botaoEnviar = formularioCliente.querySelector('button[type="submit"]');
const botaoCancelarEdicao = document.querySelector("#cancelar-edicao");
let clientes = [];
let idClienteEmEdicao = null;

// Filtra a lista atual conforme o texto digitado e recria os cards visíveis.
function exibirClientes() {
  const busca = buscaCliente.value.trim().toLowerCase();
  const resultado = clientes.filter(cliente => cliente.nome.toLowerCase().includes(busca));
  const lista = document.querySelector("#lista-clientes");

  lista.replaceChildren();
  document.querySelector("#resumo-clientes").textContent =
    `${resultado.length} cliente(s) exibido(s) de ${clientes.length} cadastrado(s).`;

  if (resultado.length === 0) {
    lista.appendChild(criarElemento("p", "Nenhum cliente encontrado."));
    return;
  }

  resultado.forEach(cliente => {
    const item = document.createElement("article");
    const acoes = document.createElement("p");
    const botaoEditar = criarElemento("button", "Editar");
    const botaoExcluir = criarElemento("button", "Excluir");

    item.appendChild(criarElemento("h3", cliente.nome));
    item.appendChild(criarElemento("p", `Telefone: ${cliente.telefone}`));

    if (cliente.email) {
      item.appendChild(criarElemento("p", `E-mail: ${cliente.email}`));
    }

    // Cada botão recebe o id do card atual por meio do fechamento da função de evento.
    botaoEditar.type = "button";
    botaoEditar.addEventListener("click", () => iniciarEdicao(cliente));
    botaoExcluir.type = "button";
    botaoExcluir.classList.add("botao-perigo");
    botaoExcluir.addEventListener("click", () => removerCliente(cliente));
    acoes.classList.add("acoes-formulario");
    acoes.append(botaoEditar, botaoExcluir);
    item.appendChild(acoes);
    lista.appendChild(item);
  });
}

// Consulta o serviço com Fetch API. O parâmetro permite demonstrar uma falha de comunicação.
async function carregarClientes(simularErro = false) {
  try {
    definirInterfaceOcupada(true, simularErro ? "Simulando erro de comunicação..." : "Consultando clientes no serviço...");
    const resposta = await consultarClientes({ simularErro });
    clientes = resposta;
    exibirClientes();
    mostrarMensagem(`${clientes.length} cliente(s) carregado(s) com sucesso.`);
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  } finally {
    definirInterfaceOcupada(false);
  }
}

// Lê e valida os campos antes de enviar os dados ao serviço simulado.
function obterDadosDoFormulario() {
  const nome = document.querySelector("#nome").value.trim();
  const telefone = document.querySelector("#telefone").value.trim();
  const campoEmail = document.querySelector("#email");
  const email = campoEmail.value.trim().toLowerCase();
  const digitosTelefone = telefone.replace(/\D/g, "");

  campoEmail.value = email;

  if (nome.length < 2 || nome.length > 80) {
    throw new Error("Informe um nome com 2 a 80 caracteres.");
  }

  if (!/^[\d\s()+-]+$/.test(telefone) || digitosTelefone.length < 10 || digitosTelefone.length > 11) {
    throw new Error("Informe um telefone com DDD e 10 ou 11 dígitos, sem letras.");
  }

  if (!campoEmail.validity.valid) {
    throw new Error("Informe um e-mail válido ou deixe esse campo vazio.");
  }

  return { nome, telefone, email };
}

// Submete um POST simulado para novo cliente ou um PUT simulado para edição.
async function salvarCliente(evento) {
  evento.preventDefault();
  limparMensagem();

  try {
    const dadosDoCliente = obterDadosDoFormulario();
    const estaEditando = idClienteEmEdicao !== null;
    definirInterfaceOcupada(true, estaEditando ? "Enviando alteração ao serviço..." : "Enviando cliente ao serviço...");

    if (estaEditando) {
      await atualizarCliente(idClienteEmEdicao, dadosDoCliente);
    } else {
      await criarCliente(dadosDoCliente);
    }

    // A consulta seguinte atualiza a tela com a resposta persistida pelo serviço.
    clientes = await consultarClientes();
    formularioCliente.reset();
    finalizarEdicao();
    exibirClientes();
    mostrarMensagem(estaEditando ? "Cliente atualizado com sucesso." : "Cliente cadastrado com sucesso.");
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  } finally {
    definirInterfaceOcupada(false);
  }
}

// Preenche o formulário com os dados do card selecionado e troca o modo de cadastro para edição.
function iniciarEdicao(cliente) {
  idClienteEmEdicao = cliente.id;
  document.querySelector("#nome").value = cliente.nome;
  document.querySelector("#telefone").value = cliente.telefone;
  document.querySelector("#email").value = cliente.email || "";
  document.querySelector("#titulo-cadastro").textContent = "Editar cliente";
  botaoEnviar.textContent = "Salvar alterações";
  botaoCancelarEdicao.hidden = false;
  limparMensagem();
  formularioCliente.scrollIntoView({ behavior: "smooth", block: "start" });
  document.querySelector("#nome").focus();
}

// Restaura o formulário para cadastro sem modificar o cliente que estava selecionado.
function finalizarEdicao() {
  idClienteEmEdicao = null;
  document.querySelector("#titulo-cadastro").textContent = "Novo cliente";
  botaoEnviar.textContent = "Salvar cliente";
  botaoCancelarEdicao.hidden = true;
}

// Pede confirmação e envia um DELETE simulado; erros de integridade são exibidos ao usuário.
async function removerCliente(cliente) {
  const confirmar = window.confirm(`Excluir o cliente ${cliente.nome}?`);

  if (!confirmar) {
    return;
  }

  limparMensagem();

  try {
    definirInterfaceOcupada(true, "Solicitando exclusão ao serviço...");
    await excluirCliente(cliente.id);
    clientes = await consultarClientes();

    if (idClienteEmEdicao === cliente.id) {
      formularioCliente.reset();
      finalizarEdicao();
    }

    exibirClientes();
    mostrarMensagem("Cliente excluído com sucesso.");
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  } finally {
    definirInterfaceOcupada(false);
  }
}

// Desativa temporariamente as ações enquanto a Promise está pendente e informa leitores de tela.
function definirInterfaceOcupada(ocupada, texto = "Carregando dados...") {
  document.querySelectorAll("button, input").forEach(elemento => {
    elemento.disabled = ocupada;
  });
  mostrarCarregamento(ocupada, texto);
}

// Registra os eventos depois que os elementos da página já foram encontrados.
formularioCliente.addEventListener("submit", salvarCliente);
formularioCliente.addEventListener("reset", () => {
  finalizarEdicao();
  limparMensagem();
});
buscaCliente.addEventListener("input", exibirClientes);
botaoCancelarEdicao.addEventListener("click", () => {
  formularioCliente.reset();
  finalizarEdicao();
  limparMensagem();
});
document.querySelector("#consultar-clientes").addEventListener("click", () => carregarClientes());
document.querySelector("#simular-erro").addEventListener("click", () => carregarClientes(true));

// A consulta inicial demonstra o carregamento automático quando a página abre.
carregarClientes();
